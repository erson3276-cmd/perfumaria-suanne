import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/olist";

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

function formatOrderMessage(payment: Record<string, any>): string {
  const items = payment?.additional_info?.items || [];
  const itemNames = items.map((i: Record<string, any>) => i.title).join(", ");
  const amount = payment?.transaction_amount;
  const payerName = payment?.payer?.first_name || "Cliente";
  const payerEmail = payment?.payer?.email || "N/A";

  return `🛒 *NOVA VENDA CONFIRMADA!*\n\n` +
    `👤 *Cliente:* ${payerName}\n` +
    `📧 *Email:* ${payerEmail}\n` +
    `📦 *Produto:* ${itemNames || "Verificar no Mercado Pago"}\n` +
    `💰 *Valor:* R$ ${amount?.toFixed(2) || "0.00"}\n` +
    `✅ *Status:* Aprovado\n\n` +
    `Acesse o painel do Mercado Pago para mais detalhes.`;
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

    console.log(
      `Webhook: payment #${id} status=${status} ref=${externalRef} amount=${amount}`
    );

    if (status === "approved") {
      console.log(`Webhook: payment #${id} APPROVED`);
      const message = formatOrderMessage(payment);
      await sendWhatsAppNotification(message);

      const items = payment?.additional_info?.items || [];
      const payer: Record<string, any> = payment?.payer || {};

      if (items.length > 0) {
        const olistItems = items.map((item: Record<string, any>) => ({
          idProduto: 0,
          quantidade: item.quantity || 1,
          valorUnitario: item.unit_price || 0,
        }));

        const orderResult = await createOrder({
          cliente: {
            nome: `${payer.first_name || ""} ${payer.last_name || ""}`.trim() || "Cliente",
            email: payer.email || "",
            telefone: payer.phone?.number || "",
          },
          itens: olistItems,
          endereco: {
            endereco: payer.address?.street_name || "",
            numero: payer.address?.street_number?.toString() || "",
            complemento: payer.address?.complement || "",
            bairro: payer.address?.neighborhood || "",
            cidade: payer.address?.city || "",
            uf: payer.address?.state || "",
            cep: payer.address?.zip_code || "",
          },
        });

        if (orderResult) {
          console.log(`Webhook: Olist order created #${orderResult}`);
        }
      }
    } else if (status === "pending" || status === "in_process") {
      console.log(`Webhook: payment #${id} PENDING`);
    } else if (status === "rejected" || status === "cancelled") {
      console.log(`Webhook: payment #${id} ${status.toUpperCase()}`);
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
