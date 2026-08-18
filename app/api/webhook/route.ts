import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

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

    const payment = await res.json();

    const status = payment?.status;
    const externalRef = payment?.external_reference;
    const amount = payment?.transaction_amount;

    console.log(
      `Webhook: payment #${id} status=${status} ref=${externalRef} amount=${amount}`
    );

    if (status === "approved") {
      console.log(`Webhook: payment #${id} APPROVED`);
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
