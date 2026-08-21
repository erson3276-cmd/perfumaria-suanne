import { NextRequest, NextResponse } from "next/server";
import { createOrder, updateOrderStatus, slugToOlistId } from "@/lib/olist";

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || "5521982755539";

async function sendWhatsAppNotification(message: string): Promise<void> {
  try {
    const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    console.log(`WhatsApp notification: ${url}`);
  } catch (err) {
    console.error("WhatsApp notification error:", err);
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
        }
      } else {
        console.warn("Webhook: no valid Olist items found for payment", id);
      }

      // Send WhatsApp notification
      const message = formatOrderMessage(payment, metadata);
      await sendWhatsAppNotification(message);

    } else if (status === "pending" || status === "in_process") {
      console.log(`Webhook: payment #${id} PENDING`);
    } else if (status === "rejected" || status === "cancelled") {
      console.log(`Webhook: payment #${id} ${status.toUpperCase()}`);
      // Note: we can't cancel Olist order here because we don't have the Olist order ID
      // This would require storing the mapping payment_id → olist_order_id
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
