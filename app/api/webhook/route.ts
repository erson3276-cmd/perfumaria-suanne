import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createOrder, updateOrderStatus, cancelOrder, slugToOlistId } from "@/lib/olist";
import { storePaymentMapping, getPaymentMapping, deletePaymentMapping } from "@/lib/kv";

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5521982755539";

const META_PIXEL_ID =
  process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function sha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

// Envia o evento de Compra direto pro Meta a partir do servidor.
// Cobre casos que o pixel do navegador perde: Pix confirmado depois que o
// cliente fechou a aba, Safari/ITP bloqueando o pixel, ad blockers, etc.
// O event_id (id do pagamento) é o mesmo usado no fbq do navegador —
// o Meta deduplica automaticamente se os dois chegarem.
async function sendMetaPurchaseEvent(
  payment: Record<string, any>,
  metadata?: Record<string, any>
): Promise<void> {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) {
    console.warn(
      "Meta CAPI: META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN não configurados — evento server-side não enviado"
    );
    return;
  }

  const customer = metadata?.customer || {};
  const payer: Record<string, any> = payment?.payer || {};
  const email: string = customer.email || payer.email || "";
  const rawPhone: string = customer.telefone || payer.phone?.number || "";
  const phoneDigits = rawPhone.replace(/\D/g, "");
  const amount = payment?.transaction_amount || 0;

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email)];
  if (phoneDigits) {
    const withCountryCode = phoneDigits.startsWith("55")
      ? phoneDigits
      : `55${phoneDigits}`;
    userData.ph = [sha256(withCountryCode)];
  }

  const eventPayload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(payment.id),
        action_source: "website",
        event_source_url: "https://perfumariasuanne.com.br/checkout",
        user_data: userData,
        custom_data: {
          currency: "BRL",
          value: amount,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("Meta CAPI: erro ao enviar evento", json);
    } else {
      console.log("Meta CAPI: Purchase enviado", json);
    }
  } catch (err) {
    console.error("Meta CAPI: falha na requisição", err);
  }
}

async function sendWhatsAppNotification(message: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_API_KEY;
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!apiKey) {
    console.warn(
      "CALLMEBOT_API_KEY não configurado — notificação de WhatsApp não enviada (só logada)"
    );
    console.log(
      `WhatsApp notification (não enviada): https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    );
    return;
  }

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
    const res = await fetch(url);
    const text = await res.text();
    if (!res.ok) {
      console.error("CallMeBot: erro ao enviar WhatsApp", text);
    } else {
      console.log("CallMeBot: notificação de WhatsApp enviada");
    }
  } catch (err) {
    console.error("CallMeBot: falha na requisição", err);
  }
}

function formatOrderMessage(
  payment: Record<string, any>,
  metadata?: Record<string, any>
): string {
  const payerName = metadata?.customer?.nome || payment?.payer?.first_name || "Cliente";
  const payerEmail = metadata?.customer?.email || payment?.payer?.email || "N/A";
  const amount = payment?.transaction_amount;

  let itemLines = "";
  if (metadata?.items && metadata.items.length > 0) {
    itemLines = metadata.items
      .map(
        (i: Record<string, any>) =>
          `• ${i.quantity}x ${i.name} (${i.brand}) — R$ ${(i.price * i.quantity).toFixed(2)}`
      )
      .join("\n");
  } else {
    const items = payment?.additional_info?.items || [];
    itemLines = items.map((i: Record<string, any>) => `• ${i.title}`).join("\n");
  }

  const customerAddress = metadata?.customer?.endereco
    ? `\n📍 ${metadata.customer.endereco}, ${metadata.customer.cidade}/${metadata.customer.uf} — CEP: ${metadata.customer.cep}`
    : "";

  return `🛒 *NOVA VENDA CONFIRMADA!*\n\n` +
    `👤 *Cliente:* ${payerName}\n` +
    `📧 *Email:* ${payerEmail}\n` +
    `📞 *Telefone:* ${metadata?.customer?.telefone || "N/A"}\n` +
    `📦 *Produtos:*\n${itemLines}\n` +
    `💰 *Valor:* R$ ${amount?.toFixed(2) || "0.00"}\n` +
    `✅ *Status:* Aprovado` +
    customerAddress;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const id = body?.data?.id;
    const type = body?.type;

    if (type !== "payment" || !id) {
      return NextResponse.json({ ok: true });
    }

    if (!ACCESS_TOKEN) {
      console.error("Webhook: MERCADOPAGO_ACCESS_TOKEN not configured");
      return NextResponse.json({ ok: true });
    }

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error("Webhook: failed to fetch payment", id);
      return NextResponse.json({ ok: true });
    }

    const payment: Record<string, any> = await res.json();

    const status = payment?.status;
    const externalRef = payment?.external_reference;
    const amount = payment?.transaction_amount;
    const metadata = payment?.metadata;

    console.log(
      `Webhook: payment #${id} status=${status} ref=${externalRef} amount=${amount}`
    );

    if (status === "approved") {
      console.log(`Webhook: payment #${id} APPROVED`);

      // Build Olist order items with correct product IDs
      const olistItems: Array<{
        idProduto: number;
        quantidade: number;
        valorUnitario: number;
      }> = [];

      // Prefer metadata (has olistId) over payment items
      if (metadata?.items && metadata.items.length > 0) {
        for (const item of metadata.items) {
          const olistId = item.olistId || slugToOlistId(item.slug);
          if (olistId && item.slug !== "frete") {
            olistItems.push({
              idProduto: olistId,
              quantidade: item.quantity || 1,
              valorUnitario: item.price || 0,
            });
          }
        }
      } else {
        // Fallback: map from payment items using slug lookup
        const items = payment?.additional_info?.items || [];
        for (const item of items) {
          const slug = item.id;
          const olistId = slugToOlistId(slug);
          if (olistId && slug !== "frete") {
            olistItems.push({
              idProduto: olistId,
              quantidade: item.quantity || 1,
              valorUnitario: item.unit_price || 0,
            });
          }
        }
      }

      // Create Olist order if we have valid items
      if (olistItems.length > 0) {
        const customer = metadata?.customer || {};
        const payer: Record<string, any> = payment?.payer || {};

        const orderResult = await createOrder({
          cliente: {
            nome: customer.nome || `${payer.first_name || ""} ${payer.last_name || ""}`.trim() || "Cliente",
            email: customer.email || payer.email || "",
            telefone: customer.telefone || payer.phone?.number || "",
          },
          itens: olistItems,
          endereco: {
            endereco: customer.endereco || payer.address?.street_name || "",
            numero: customer.numero || payer.address?.street_number?.toString() || "",
            complemento: customer.complemento || payer.address?.complement || "",
            bairro: customer.bairro || payer.address?.neighborhood || "",
            cidade: customer.cidade || payer.address?.city || "",
            uf: customer.uf || payer.address?.state || "",
            cep: customer.cep || payer.address?.zip_code || "",
          },
        });

        if (orderResult) {
          console.log(`Webhook: Olist order created #${orderResult}`);

          // Update order status to Aprovado
          await updateOrderStatus(orderResult, "Aprovado");

          // Store payment → order mapping so we can cancel on rejection
          await storePaymentMapping(id, orderResult, externalRef || "");
        }
      } else {
        console.warn("Webhook: no valid Olist items found for payment", id);
      }

      // Envia o evento de Compra pro Meta via Conversions API
      await sendMetaPurchaseEvent(payment, metadata);

      // Send WhatsApp notification
      const message = formatOrderMessage(payment, metadata);
      await sendWhatsAppNotification(message);

    } else if (status === "pending" || status === "in_process") {
      console.log(`Webhook: payment #${id} PENDING`);
    } else if (status === "rejected" || status === "cancelled") {
      console.log(`Webhook: payment #${id} ${status.toUpperCase()}`);

      // Look up the Olist order via KV mapping and cancel it
      const mapping = await getPaymentMapping(id);
      if (mapping?.olistOrderId) {
        const cancelled = await cancelOrder(mapping.olistOrderId);
        if (cancelled) {
          console.log(`Webhook: Olist order #${mapping.olistOrderId} cancelled (payment ${status})`);
        } else {
          console.error(`Webhook: failed to cancel Olist order #${mapping.olistOrderId}`);
        }
        await deletePaymentMapping(id);
      } else {
        console.warn(`Webhook: no Olist mapping found for payment #${id} — order not cancelled`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Not allowed." }, { status: 405 });
}
