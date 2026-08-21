import { NextRequest, NextResponse } from "next/server";
import { getStock, searchOrders, getProduct } from "@/lib/olist";
import { products } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, productIds } = body;

    // Single product stock check
    if (productId) {
      const stock = await getStock(productId);
      if (stock === null) {
        return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
      }
      return NextResponse.json({ stock, inStock: stock > 0 });
    }

    // Batch stock check for all products
    if (productIds && Array.isArray(productIds)) {
      const results: Record<number, number | null> = {};
      for (const id of productIds) {
        results[id] = await getStock(id);
      }
      return NextResponse.json({ stocks: results });
    }

    // Check all products with olistId
    const allOlistIds = products
      .filter((p) => p.olistId)
      .map((p) => p.olistId as number);

    const results: Record<number, { stock: number | null; slug: string }> = {};
    for (const id of allOlistIds) {
      const product = products.find((p) => p.olistId === id);
      results[id] = {
        stock: await getStock(id),
        slug: product?.slug || "unknown",
      };
    }
    return NextResponse.json({ stocks: results });
  } catch (err) {
    console.error("Stock API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST." }, { status: 405 });
}
