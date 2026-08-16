"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, shippingFor } from "@/lib/site";
import ProductImage from "@/components/ProductImage";
import FreteCalculator from "@/components/FreteCalculator";
import {
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@/components/icons";

export default function CartPage() {
  const { lines, subtotal, count, setQty, remove, clear } = useCart();
  const shipping = shippingFor(subtotal);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="font-serif text-3xl text-ivory">Seu carrinho está vazio</p>
        <p className="mt-3 text-ivory-soft">
          Explore nossa coleção e encontre a essência perfeita para você.
        </p>
        <Link href="/produtos" className="btn-gold mt-8">
          Explorar Perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Perfumaria Suanne</p>
      <h1 className="mt-2 font-serif text-3xl text-ivory sm:text-5xl">
        Seu Carrinho
      </h1>
      <p className="mt-2 text-sm text-ivory-soft">
        {count} {count === 1 ? "item" : "itens"} na sacola
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <ul className="divide-y divide-gold/20 border-y border-gold/20">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="flex flex-col gap-4 py-6 sm:flex-row">
                <Link
                  href={`/produtos/${product.slug}`}
                  className="relative block h-36 w-28 shrink-0 overflow-hidden bg-ink ring-1 ring-gold/25"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    sizes="112px"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold">
                      {product.brand}
                    </span>
                    <Link
                      href={`/produtos/${product.slug}`}
                      className="mt-1 block font-serif text-xl text-ivory hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-ivory-soft">
                      {product.size} · {formatBRL(product.price)} cada
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center border border-gold/40">
                      <button
                        onClick={() => setQty(product.slug, qty - 1)}
                        aria-label="Diminuir quantidade"
                        className="px-3 py-2 text-ivory hover:text-gold"
                      >
                        <IconMinus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center font-serif text-ivory">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(product.slug, qty + 1)}
                        aria-label="Aumentar quantidade"
                        className="px-3 py-2 text-ivory hover:text-gold"
                      >
                        <IconPlus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-lg text-ivory">
                        {formatBRL(product.price * qty)}
                      </span>
                      <button
                        onClick={() => remove(product.slug)}
                        aria-label="Remover do carrinho"
                        className="text-ivory-soft transition-colors hover:text-wine"
                      >
                        <IconTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={clear}
            className="mt-4 text-xs uppercase tracking-[0.15em] text-ivory-soft underline-offset-4 hover:text-wine hover:underline"
          >
            Limpar carrinho
          </button>
        </div>

        <aside className="h-fit border border-gold/30 bg-cream p-7">
          <h2 className="font-serif text-xl text-ivory">Resumo do Pedido</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-ivory-soft">
              <dt>Subtotal</dt>
              <dd>{formatBRL(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ivory-soft">
              <dt>Frete</dt>
              <dd>{shipping.free ? "Grátis" : formatBRL(shipping.fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-gold/25 pt-3 text-ivory">
              <dt className="font-semibold uppercase tracking-[0.15em]">
                Total
              </dt>
              <dd className="font-serif text-2xl">
                {formatBRL(subtotal + shipping.fee)}
              </dd>
            </div>
          </dl>

          <FreteCalculator className="mt-5" value={subtotal} />

          <Link href="/checkout" className="btn-gold mt-6 w-full">
            Finalizar Compra
            <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/produtos"
            className="mt-3 block text-center text-xs uppercase tracking-[0.2em] text-gold hover:text-ivory"
          >
            Continuar comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
