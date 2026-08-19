import { NextRequest, NextResponse } from "next/server";
import { getStock } from "@/lib/olist";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const stock = await getStock(productId);

    if (stock === null) {
      return NextResponse.json(
        { error: "Failed to fetch stock" },
        { status: 500 }
      );
    }

    return NextResponse.json({ stock, inStock: stock > 0 });
  } catch (err) {
    console.error("Stock API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Not allowed." }, { status: 405 });
}
