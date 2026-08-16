"use client";

import { useEffect, useRef, useState } from "react";

type MPPayment = {
  id: string | number;
  status: string;
  status_detail: string;
};

type PaymentBrickInstance = {
  unmount: () => void;
};

const BRICK_CONTAINER_ID = "payment-brick-container";

type MercadoPagoConstructor = new (
  publicKey: string,
  options?: { locale?: string }
) => {
  bricks: () => Promise<{
    create: (
      kind: "payment",
      container: string,
      settings: Record<string, unknown>
    ) => Promise<PaymentBrickInstance>;
  }>;
};

declare global {
  interface Window {
    MercadoPago: MercadoPagoConstructor;
  }
}

type PaymentBrickProps = {
  preferenceId: string;
  amount: number;
  payerEmail?: string;
  onApproved: (payment: MPPayment) => void;
  onCancel: () => void;
};

type PixData = {
  paymentId: string | number;
  qrCode: string;
  qrCodeBase64: string;
  expiresIn: string;
};

export default function PaymentBrick({
  preferenceId,
  amount,
  payerEmail,
  onApproved,
  onCancel,
}: PaymentBrickProps) {
  const [method, setMethod] = useState<"pix" | "card" | null>(null);
  const [pix, setPix] = useState<PixData | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createPix = async () => {
    if (!payerEmail) return;
    setPixLoading(true);
    setPixError(null);
    setCopied(false);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method_id: "pix",
          transaction_amount: amount,
          payer: { email: payerEmail },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Não foi possível gerar o Pix.");
      }
      const td = data?.point_of_interaction?.transaction_data ?? {};
      setPix({
        paymentId: data.id,
        qrCode: td.qr_code ?? "",
        qrCodeBase64: td.qr_code_base64 ?? "",
        expiresIn: td.expires_in ?? "",
      });
    } catch (err) {
      setPixError(
        err instanceof Error ? err.message : "Não foi possível gerar o Pix."
      );
    } finally {
      setPixLoading(false);
    }
  };

  const copyCode = async () => {
    if (!pix?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pix.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (pix) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ivory">Pix</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
          >
            ← Voltar aos dados
          </button>
        </div>

        <div className="mt-6 border border-gold/25 bg-cream p-6 text-center">
          <p className="text-sm text-ivory-soft">
            Aponte a câmera do seu banco para o QR code e pague em segundos.
          </p>

          {pix.qrCodeBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR Code Pix"
              className="mx-auto mt-5 h-56 w-56 object-contain"
            />
          ) : (
            <div className="mx-auto mt-5 flex h-56 w-56 items-center justify-center border border-gold/30 text-ivory-soft">
              QR indisponível
            </div>
          )}

          <p className="mt-5 text-xs text-ivory-soft">
            Pagamento <span className="text-ivory">#{pix.paymentId}</span>{" "}
            {pix.expiresIn
              ? `• expira em ${pix.expiresIn}`
              : "• aguardando pagamento"}
          </p>

          {pix.qrCode && (
            <button
              type="button"
              onClick={copyCode}
              className="btn-outline mt-4 w-full"
            >
              {copied ? "Código copiado!" : "Copiar código Pix (copia e cola)"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMethod(null)}
            className="mt-3 text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
          >
            ← Escolher outro meio de pagamento
          </button>
        </div>
      </div>
    );
  }

  if (method === "pix") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ivory">Pix</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
          >
            ← Voltar aos dados
          </button>
        </div>

        <div className="mt-6 border border-gold/25 bg-cream p-6 text-center">
          <p className="text-sm leading-relaxed text-ivory-soft">
            Gere o QR code e pague na hora pelo app do seu banco.
          </p>

          {pixError && (
            <p className="mt-4 border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {pixError}
            </p>
          )}

          <button
            type="button"
            onClick={createPix}
            disabled={pixLoading}
            className="btn-gold mt-5 w-full"
          >
            {pixLoading ? "Gerando QR code…" : "Gerar QR code Pix"}
          </button>

          <button
            type="button"
            onClick={() => setMethod(null)}
            className="mt-3 text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
          >
            ← Escolher outro meio de pagamento
          </button>
        </div>
      </div>
    );
  }

  if (method === "card") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ivory">Pagamento</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
          >
            ← Voltar aos dados
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMethod(null)}
          className="mt-6 text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
        >
          ← Escolher outro meio de pagamento
        </button>

        <CardBrick
          preferenceId={preferenceId}
          amount={amount}
          payerEmail={payerEmail}
          onApproved={onApproved}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-ivory">Pagamento</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-ivory-soft underline-offset-2 hover:text-ivory hover:underline"
        >
          ← Voltar aos dados
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => {
            setPix(null);
            setPixError(null);
            setMethod("pix");
          }}
          className="flex w-full items-center justify-between border border-gold/30 bg-cream p-6 text-left hover:border-gold"
        >
          <span>
            <span className="block font-serif text-lg text-ivory">Pix</span>
            <span className="mt-1 block text-sm text-ivory-soft">
              Pague na hora com QR code — aprovação imediata.
            </span>
          </span>
          <span className="text-2xl text-gold">→</span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("card")}
          className="flex w-full items-center justify-between border border-gold/30 bg-cream p-6 text-left hover:border-gold"
        >
          <span>
            <span className="block font-serif text-lg text-ivory">
              Cartão de crédito ou débito
            </span>
            <span className="mt-1 block text-sm text-ivory-soft">
              Parcelamento disponível.
            </span>
          </span>
          <span className="text-2xl text-gold">→</span>
        </button>
      </div>
    </div>
  );
}

function CardBrick({
  preferenceId,
  amount,
  payerEmail,
  onApproved,
}: {
  preferenceId: string;
  amount: number;
  payerEmail?: string;
  onApproved: (payment: MPPayment) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<PaymentBrickInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let disposed = false;

    const loadSdk = (): Promise<void> =>
      new Promise((resolve, reject) => {
        const src = "https://sdk.mercadopago.com/js/v2";
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error("Não foi possível carregar o pagamento."));
        document.head.appendChild(script);
      });

    const init = async () => {
      const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
      if (!publicKey) {
        setError("Pagamento não configurado no momento.");
        return;
      }
      try {
        await loadSdk();
        if (cancelled || !containerRef.current) return;

        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });

        const bricks = await mp.bricks();
        const instance = await bricks.create("payment", BRICK_CONTAINER_ID, {
          initialization: {
            amount,
            preferenceId,
            payer: {
              email: payerEmail ?? "",
            },
          },
          customization: {
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              prepaidCard: "all",
            },
            visual: { style: { theme: "default", verticalPadding: "16px" } },
          },
          callbacks: {
            onReady: () => {
              if (!cancelled) setReady(true);
            },
            onSubmit: ({ formData }: { formData: Record<string, unknown> }) =>
              fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
              })
                .then((res) => res.json())
                .then((payment: MPPayment) => {
                  if (
                    payment.status === "approved" ||
                    payment.status === "pending" ||
                    payment.status === "in_process"
                  ) {
                    if (payment.status === "approved" && !cancelled) {
                      onApproved(payment);
                    }
                    return { type: "success", detail: payment };
                  }
                  return { type: "error", detail: payment };
                })
                .catch(() => ({
                  type: "error" as const,
                  detail: { message: "Pagamento recusado. Tente novamente." },
                })),
            onError: (brickError: { message?: string }) => {
              if (!cancelled) {
                setError(
                  brickError?.message ||
                    "Ocorreu um erro ao processar o pagamento."
                );
              }
            },
          },
        });

        if (cancelled) {
          instance.unmount();
          return;
        }
        instanceRef.current = instance;
      } catch (err) {
        if (!cancelled) {
          console.error("PaymentBrick init error:", err);
          setError("Não foi possível iniciar o pagamento. Tente novamente.");
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (!disposed) {
        disposed = true;
        instanceRef.current?.unmount();
        instanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenceId, amount, payerEmail]);

  return (
    <>
      {!ready && !error && (
        <div className="mt-6 border border-gold/25 bg-cream px-6 py-8 text-center text-sm text-ivory-soft">
          Carregando formas de pagamento seguras…
        </div>
      )}

      {error && (
        <div className="mt-6 space-y-4">
          <p className="border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        id={BRICK_CONTAINER_ID}
        className={`mt-6 ${error || !ready ? "hidden" : ""}`}
      />
    </>
  );
}
