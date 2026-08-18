import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

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

    const payment_method_id = body?.payment_method_id;
    const payer_email = body?.payer?.email;

    if (!payment_method_id || !payer_email) {
      return NextResponse.json(
        { error: "Dados de pagamento inválidos." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payer_email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    const allowedMethods = ["pix", "visa", "mastercard", "amex", "elo", "hipercard", "debit_card"];
    if (!allowedMethods.includes(payment_method_id)) {
      return NextResponse.json(
        { error: "Método de pagamento não aceito." },
        { status: 400 }
      );
    }

    let transaction_amount = Number(body?.transaction_amount);

    if (!transaction_amount || transaction_amount <= 0) {
      return NextResponse.json(
        { error: "Valor inválido." },
        { status: 400 }
      );
    }

    const items = Array.isArray(body?.items) ? body.items : [];
    if (items.length > 0) {
      let calculated = 0;
      for (const item of items) {
        const product = products.find((p) => p.slug === item.id);
        if (!product) continue;
        const qty = Math.max(1, Math.min(10, Number(item.quantity) || 1));
        calculated += product.price * qty;
      }
      if (calculated > 0) {
        if (calculated < site.freeShippingAbove) {
          calculated += site.shippingFee;
        }
        transaction_amount = Math.round(calculated * 100) / 100;
      }
    }

    const installments = Number(body?.installments) || 1;

    const payload = {
      transaction_amount,
      description: "Perfumaria Suanne",
      payment_method_id,
      payer: { email: payer_email },
      installments,
      statement_descriptor: "PERFUMARIA SUANNE",
      notification_url: `${new URL(req.url).origin}/api/webhook`,
    };

    const res = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("MP payment error:", data?.status || data?.error || "unknown");
      return NextResponse.json(
        { error: "Pagamento recusado. Tente novamente." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      transaction_amount: data.transaction_amount,
    });
  } catch (err) {
    console.error("payment error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
