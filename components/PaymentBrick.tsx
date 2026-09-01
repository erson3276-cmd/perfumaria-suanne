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

export default function PaymentBrick({
  preferenceId,
  payerEmail,
  onApproved,
  onCancel,
}: PaymentBrickProps) {
  const [method, setMethod] = useState<"pix" | "card" | null>(null);

  const methodTitle = method === "pix" ? "Pix" : "Pagamento";

  if (method) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-ivory">{methodTitle}</h3>
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

        <PaymentBrickNative
          method={method}
          preferenceId={preferenceId}
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
          onClick={() => setMethod("pix")}
          className="flex w-full items-center justify-between border border-gold/30 bg-cream p-6 text-left hover:border-gold"
        >
          <span>
            <span className="block font-serif text-lg text-ivory">Pix</span>
            <span className="mt-1 block text-sm text-ivory-soft">
              Pague na hora com QR code — aprovação automática.
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

function PaymentBrickNative({
  method,
  preferenceId,
  payerEmail,
  onApproved,
}: {
  method: "pix" | "card";
  preferenceId: string;
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
            preferenceId,
            payer: {
              email: payerEmail ?? "",
            },
          },
          customization: {
            paymentMethods:
              method === "pix"
                ? { bankTransfer: ["pix"] }
                : {
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
            onSubmit: ({ formData }: { formData: Record<string, unknown> }) => {
              const mergedFormData = {
                ...formData,
                preferenceId,
              };
              return fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mergedFormData),
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
                }));
            },
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
  }, [method, preferenceId, payerEmail, onApproved]);

  return (
    <>
      {!ready && !error && (
        <div className="mt-6 border border-gold/25 bg-cream px-6 py-8 text-center text-sm text-ivory-soft">
          {method === "pix"
            ? "Carregando opções de Pix…"
            : "Carregando formas de pagamento seguras…"}
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
