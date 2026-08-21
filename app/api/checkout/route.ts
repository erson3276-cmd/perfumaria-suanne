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
    const items = Array.isArray(body?.items) ? body.items : [];
    const customer = body?.customer || null;

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio." },
        { status: 400 }
      );
    }

    const preferenceItems = [];
    let total = 0;

    for (const item of items) {
      const product = products.find((p) => p.slug === item.id);
      const qty = Math.max(1, Math.min(10, Number(item.quantity) || 1));
      if (!product) continue;
      total += product.price * qty;
      preferenceItems.push({
        id: product.slug,
        title: `${product.name} — ${product.brand}`,
        quantity: qty,
        unit_price: product.price,
        currency_id: "BRL",
      });
    }

    if (preferenceItems.length === 0) {
      return NextResponse.json(
        { error: "Itens inválidos no carrinho." },
        { status: 400 }
      );
    }

    if (total < site.freeShippingAbove) {
      preferenceItems.push({
        id: "frete",
        title: "Frete fixo — todo o Brasil",
        quantity: 1,
        unit_price: site.shippingFee,
        currency_id: "BRL",
      });
      total += site.shippingFee;
    }

    const origin = new URL(req.url).origin;

    // Encode customer data and items in metadata for webhook
    const orderMetadata = {
      customer: customer || {},
      items: items.map((item: { id: string; quantity: number }) => {
        const product = products.find((p) => p.slug === item.id);
        return {
          slug: item.id,
          olistId: product?.olistId || null,
          name: product?.name || item.id,
          brand: product?.brand || "",
          quantity: Math.max(1, Math.min(10, Number(item.quantity) || 1)),
          price: product?.price || 0,
        };
      }),
      subtotal: total,
    };

    const preference = {
      items: preferenceItems,
      external_reference: `PS-${Date.now()}`,
      statement_descriptor: "PERFUMARIA SUANNE",
      metadata: orderMetadata,
      back_urls: {
        success: `${origin}/checkout?status=success`,
        pending: `${origin}/checkout?status=pending`,
        failure: `${origin}/checkout?status=failure`,
      },
      auto_return: "approved",
      notification_url: `${origin}/api/webhook`,
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("MP preference error:", data?.status || data?.error || "unknown");
      return NextResponse.json(
        { error: "Falha ao criar pagamento." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: data.id,
      amount: Math.round(total * 100) / 100,
    });
  } catch (err) {
    console.error("checkout error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
