import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Pagamento não configurado." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const origin = new URL(req.url).origin;

    const payload = {
      ...body,
      statement_descriptor: "PERFUMARIA SUANNE",
      notification_url: `${origin}/api/webhook`,
    };

    const res = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("MP payment error", data);
      return NextResponse.json(
        { error: "Pagamento recusado. Tente novamente." },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("payment error", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
