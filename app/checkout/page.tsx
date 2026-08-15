"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, shippingFor, site, whatsappLink } from "@/lib/site";
import {
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics";
import type { AnalyticsItem } from "@/lib/analytics";
import { IconShield, IconWhatsapp } from "@/components/icons";
import PaymentBrick from "@/components/PaymentBrick";
import FreteCalculator from "@/components/FreteCalculator";

type CustomerForm = {
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
  observacoes: string;
};

type OrderItem = {
  qty: number;
  name: string;
  brand: string;
  price: number;
};

type OrderSnapshot = {
  reference: string;
  items: OrderItem[];
  subtotal: number;
  customer: CustomerForm;
};

const SNAPSHOT_KEY = "perfumaria-suanne-last-order";

function readSnapshot(): OrderSnapshot | null {
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as OrderSnapshot) : null;
  } catch {
    return null;
  }
}

function buildMessage(snapshot: OrderSnapshot, paidText: string): string {
  const { items, subtotal, customer } = snapshot;
  const total = subtotal + shippingFor(subtotal).fee;
  const itemLines = items
    .map(
      (it) => `• ${it.qty}x ${it.name} (${it.brand}) — ${formatBRL(
        it.price * it.qty
      )}`
    )
    .join("\n");

  return [
    `✦ PEDIDO — ${site.name}`,
    "",
    "🛍️ ITENS:",
    itemLines,
    "",
    `💰 TOTAL: ${formatBRL(total)}`,
    paidText,
    "",
    "👤 DADOS DO CLIENTE:",
    `Nome: ${customer.nome}`,
    `E-mail: ${customer.email}`,
    `Telefone: ${customer.telefone}`,
    `CEP: ${customer.cep}`,
    `Endereço: ${customer.endereco}`,
    `Cidade/UF: ${customer.cidade}/${customer.uf}`,
    customer.observacoes
      ? `📝 Observações: ${customer.observacoes}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const shipping = shippingFor(subtotal);
  const [step, setStep] = useState<"form" | "paying" | "paid">("form");
  const [preference, setPreference] = useState<{ id: string; amount: number } | null>(null);
  const [snapshot, setSnapshot] = useState<OrderSnapshot | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paidStatus, setPaidStatus] = useState("approved");
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerForm>({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    cidade: "",
    uf: "",
    observacoes: "",
  });

  const set = (field: keyof CustomerForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const firePurchaseIfNew = (paymentId: string | null) => {
    if (!paymentId) return;
    try {
      const fired = JSON.parse(
        window.sessionStorage.getItem("perfumaria-suanne-fired") ?? "[]"
      ) as string[];
      if (fired.includes(paymentId)) return;
      fired.push(paymentId);
      window.sessionStorage.setItem(
        "perfumaria-suanne-fired",
        JSON.stringify(fired)
      );
    } catch {
      // segue sem dedupe se o storage falhar
    }
    const saved = readSnapshot();
    if (!saved || saved.items.length === 0) return;
    const items: AnalyticsItem[] = saved.items.map((it) => ({
      slug: it.name,
      name: it.name,
      brand: it.brand,
      category: "Perfume",
      price: it.price,
      qty: it.qty,
    }));
    const total = saved.subtotal + shippingFor(saved.subtotal).fee;
    trackPurchase(items, saved.subtotal, total, paymentId);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success" || status === "pending") {
      const saved = readSnapshot();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setSnapshot(saved);
      const id = params.get("payment_id");
      setPaymentId(id);
      setPaidStatus(status === "pending" ? "pending" : "approved");
      setStep("paid");
      clear();
      firePurchaseIfNew(id);
    }
  }, [clear]);

  const orderItems = useMemo<OrderItem[]>(
    () =>
      lines.map(({ product, qty }) => ({
        qty,
        name: product.name,
        brand: product.brand,
        price: product.price,
      })),
    [lines]
  );

  const analyticsItems = useMemo<AnalyticsItem[]>(
    () =>
      lines.map(({ product, qty }) => ({
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        qty,
      })),
    [lines]
  );

  useEffect(() => {
    if (step === "paying" && analyticsItems.length > 0) {
      trackBeginCheckout(analyticsItems, subtotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const saveSnapshot = (reference: string) => {
    const next: OrderSnapshot = {
      reference,
      items: orderItems,
      subtotal,
      customer: { ...form },
    };
    try {
      window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next));
    } catch {
      // storage indisponível — segue sem persistência
    }
    setSnapshot(next);
  };

  const handlePayOnline = async () => {
    if (
      !form.nome ||
      !form.email ||
      !form.telefone ||
      !form.cep ||
      !form.endereco ||
      !form.cidade ||
      !form.uf
    ) {
      setError("Preencha os dados pessoais e de entrega antes de pagar.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.product.slug, quantity: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Falha ao iniciar o pagamento.");
        return;
      }
      saveSnapshot(data.id);
      setPreference({ id: data.id, amount: data.amount });
      setStep("paying");
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
    }
  };

  const handleWhatsappSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      `✦ NOVO PEDIDO — ${site.name}`,
      "",
      "🛍️ ITENS:",
      orderItems
        .map(
          (it) =>
            `• ${it.qty}x ${it.name} (${it.brand}) — ${formatBRL(
              it.price * it.qty
            )}`
        )
        .join("\n"),
      "",
      `💰 SUBTOTAL: ${formatBRL(subtotal)}`,
      `🚚 FRETE: ${shipping.free ? "Grátis" : formatBRL(shipping.fee)}`,
      "",
      "👤 DADOS DO CLIENTE:",
      `Nome: ${form.nome}`,
      `E-mail: ${form.email}`,
      `Telefone: ${form.telefone}`,
      `CEP: ${form.cep}`,
      `Endereço: ${form.endereco}`,
      `Cidade/UF: ${form.cidade}/${form.uf}`,
      form.observacoes ? `📝 Observações: ${form.observacoes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(whatsappLink(message), "_blank");
  };

  if (lines.length === 0 && step !== "paid") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="font-serif text-3xl text-ivory">
          Nenhum item para finalizar
        </p>
        <p className="mt-3 text-ivory-soft">
          Adicione perfumes ao carrinho antes de finalizar a compra.
        </p>
        <Link href="/produtos" className="btn-gold mt-8">
          Explorar Perfumes
        </Link>
      </div>
    );
  }

  if (step === "paid") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950/60 text-2xl text-emerald-300">
          ✓
        </div>
        <h1 className="mt-6 font-serif text-3xl text-ivory sm:text-4xl">
          {paidStatus === "pending"
            ? "Pagamento pendente"
            : "Pagamento aprovado!"}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ivory-soft">
          {paidStatus === "pending"
            ? "Recebemos sua solicitação de pagamento. Assim que o pagamento for confirmado, envie seus dados no WhatsApp para combinarmos a entrega."
            : "Recebemos seu pagamento com sucesso. Envie o resumo do pedido no nosso WhatsApp para confirmarmos os dados e o frete."}
        </p>

        {paymentId && (
          <p className="mt-3 text-sm text-ivory-soft">
            Pagamento <span className="font-semibold text-ivory">#{paymentId}</span>
          </p>
        )}

        {snapshot && (
          <div className="mt-8 border border-gold/30 bg-cream p-6 text-left">
            <h2 className="font-serif text-xl text-ivory">Resumo do Pedido</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {snapshot.items.map((it, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span className="text-ivory-soft">
                    {it.qty}x <span className="text-ivory">{it.name}</span>
                  </span>
                  <span className="text-ivory">
                    {formatBRL(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-gold/25 pt-3 font-numeral text-lg text-ivory">
              <span>Total</span>
              <span>
                {formatBRL(
                  snapshot.subtotal + shippingFor(snapshot.subtotal).fee
                )}
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {snapshot && (
            <a
              href={whatsappLink(
                buildMessage(
                  snapshot,
                  paidStatus === "pending"
                    ? `💳 PAGAMENTO: ${formatBRL(
                        snapshot.subtotal + shippingFor(snapshot.subtotal).fee
                      )} (aguardando confirmação via Mercado Pago)`
                    : `💳 PAGAMENTO: ${formatBRL(
                        snapshot.subtotal + shippingFor(snapshot.subtotal).fee
                      )} pago via Mercado Pago${
                        paymentId ? ` (#${paymentId})` : ""
                      }`
                )
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              <IconWhatsapp className="h-4 w-4" />
              Confirmar Pedido no WhatsApp
            </a>
          )}
          <Link href="/produtos" className="btn-outline">
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  if (step === "paying" && preference) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <p className="eyebrow">Perfumaria Suanne</p>
        <h1 className="mt-2 font-serif text-3xl text-ivory sm:text-5xl">
          Pagamento
        </h1>
        <PaymentBrick
          preferenceId={preference.id}
          amount={preference.amount}
          onApproved={(payment) => {
            setPaymentId(String(payment.id));
            setPaidStatus("approved");
            setSnapshot(readSnapshot());
            setStep("paid");
            clear();
            firePurchaseIfNew(String(payment.id));
          }}
          onCancel={() => {
            setStep("form");
            setPreference(null);
          }}
        />
      </div>
    );
  }

  const shippingLines = [
    `Frete grátis em compras acima de ${formatBRL(
      site.freeShippingAbove
    )}. Abaixo disso, frete fixo de ${formatBRL(
      site.shippingFee
    )} em todo o Brasil.`,
    "Pagamento seguro processado pelo Mercado Pago.",
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Perfumaria Suanne</p>
      <h1 className="mt-2 font-serif text-3xl text-ivory sm:text-5xl">
        Finalizar Compra
      </h1>

      <form
        onSubmit={handleWhatsappSubmit}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-10">
          <fieldset>
            <legend className="mb-4 font-serif text-xl text-ivory">
              1. Dados Pessoais
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Nome completo"
                value={form.nome}
                onChange={set("nome")}
                className="input-lux"
              />
              <input
                required
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={set("email")}
                className="input-lux"
              />
              <input
                required
                type="tel"
                placeholder="Telefone / WhatsApp"
                value={form.telefone}
                onChange={set("telefone")}
                className="input-lux"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-serif text-xl text-ivory">
              2. Entrega
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="CEP"
                value={form.cep}
                onChange={set("cep")}
                className="input-lux"
              />
              <input
                required
                placeholder="Endereço (rua, número, complemento)"
                value={form.endereco}
                onChange={set("endereco")}
                className="input-lux sm:col-span-2"
              />
              <input
                required
                placeholder="Cidade"
                value={form.cidade}
                onChange={set("cidade")}
                className="input-lux"
              />
              <input
                required
                placeholder="UF"
                maxLength={2}
                value={form.uf}
                onChange={set("uf")}
                className="input-lux"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-serif text-xl text-ivory">
              3. Pagamento
            </legend>
            <p className="text-sm leading-relaxed text-ivory-soft">
              Na próxima etapa você poderá pagar com{" "}
              <strong className="text-ivory">Pix</strong>, cartão de crédito ou
              débito, de forma segura pelo Mercado Pago. Também aceitamos
              pedidos pelo WhatsApp.
            </p>
            <textarea
              placeholder="Observações (opcional): ponto de referência, recado para o presente, etc."
              value={form.observacoes}
              onChange={set("observacoes")}
              rows={3}
              className="input-lux mt-4"
            />
          </fieldset>
        </div>

        <aside className="h-fit border border-gold/30 bg-cream p-7 lg:sticky lg:top-36">
          <h2 className="font-serif text-xl text-ivory">Seu Pedido</h2>
          <ul className="mt-5 space-y-3">
            {lines.map(({ product, qty }) => (
              <li
                key={product.slug}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex-1 truncate text-ivory-soft">
                  {qty}x <span className="text-ivory">{product.name}</span>
                </span>
                <span className="text-ivory">
                  {formatBRL(product.price * qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-gold/25 pt-4 text-sm">
            <div className="flex justify-between text-ivory-soft">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ivory-soft">
              <dt>Frete</dt>
              <dd>{shipping.free ? "Grátis" : formatBRL(shipping.fee)}</dd>
            </div>
            <div className="flex justify-between text-ivory">
              <dt className="font-semibold uppercase tracking-[0.15em]">
                Total
              </dt>
              <dd className="font-numeral text-2xl">
                {formatBRL(subtotal + shipping.fee)}
              </dd>
            </div>
          </dl>
          <FreteCalculator className="mt-5" value={subtotal} />
          <ul className="mt-5 space-y-2 text-xs leading-relaxed text-ivory-soft">
            {shippingLines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-gold">✦</span>
                {line}
              </li>
            ))}
          </ul>

          {error && (
            <p className="mt-4 border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handlePayOnline}
            className="btn-gold mt-6 w-full"
          >
            <IconShield className="h-4 w-4" />
            Pagar com Pix ou Cartão
          </button>

          <button type="submit" className="btn-outline mt-3 w-full">
            <IconWhatsapp className="h-4 w-4" />
            Enviar Pedido no WhatsApp
          </button>

          <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ivory-soft">
            <IconShield className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Pagamento seguro e processado pelo Mercado Pago. Se preferir, seu
            pedido também pode ser confirmado pelo WhatsApp.
          </p>
        </aside>
      </form>
    </div>
  );
}
