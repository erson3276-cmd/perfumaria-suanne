import { NextRequest, NextResponse } from "next/server";
import { searchOrders, getOrder } from "@/lib/olist";

// Simple admin auth check
function isAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminSecret = process.env.ADMIN_SECRET || "perfumaria-suanne-admin-2024";
  return authHeader === `Bearer ${adminSecret}`;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("id");
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Get single order
    if (orderId) {
      const order = await getOrder(parseInt(orderId));
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({ order });
    }

    // Search orders
    const result = await searchOrders({
      situacao: status || undefined,
      pagina: page,
    });

    return NextResponse.json({
      orders: result.pedidos,
      totalPages: result.totalPaginas,
      page,
    });
  } catch (err) {
    console.error("Admin orders error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
