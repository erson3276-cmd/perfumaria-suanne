import { NextRequest, NextResponse } from "next/server";
import { generatePixPayload, generatePixQrCode } from "@/lib/pix";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body?.amount);

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Valor inválido." },
        { status: 400 }
      );
    }

    const pixKey = process.env.PIX_KEY;

    if (!pixKey) {
      return NextResponse.json(
        { error: "Chave Pix não configurada." },
        { status: 500 }
      );
    }

    const payload = generatePixPayload(amount);
    const qrCodeDataUrl = await generatePixQrCode(amount);

    return NextResponse.json({ payload, qrCodeDataUrl });
  } catch (err) {
    console.error("pix error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
