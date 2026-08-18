"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/site";
import ProductImage from "@/components/ProductImage";
import {
  IconClose,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@/components/icons";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQty, remove } =
    useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-gold/30 px-6 py-5">
          <h2 className="font-serif text-xl text-ivory">
            Seu Carrinho{" "}
            {count > 0 && (
              <span className="text-gold">({count} {count === 1 ? "item" : "itens"})</span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="text-ivory transition-colors hover:text-gold"
          >
            <IconClose className="h-6 w-6" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="font-serif text-2xl text-gold">✦</span>
            <p className="font-serif text-xl text-ivory">
              Seu carrinho está vazio
            </p>
            <p className="text-sm text-ivory-soft">
              Descubra nossas essências de luxo e presenteie seus sentidos.
            </p>
            <Link
              href="/produtos"
              onClick={closeCart}
              className="btn-gold mt-2"
            >
              Explorar Perfumes
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-gold/20">
                {lines.map(({ product, qty }) => (
                  <li key={product.slug} className="flex gap-4 py-4">
                    <Link
                      href={`/produtos/${product.slug}`}
                      onClick={closeCart}
                      className="relative block h-24 w-20 shrink-0 overflow-hidden bg-ink ring-1 ring-gold/25"
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                        {product.brand}
                      </span>
                      <Link
                        href={`/produtos/${product.slug}`}
                        onClick={closeCart}
                        className="font-serif text-base leading-snug text-ivory hover:text-gold"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gold/40">
                          <button
                            onClick={() => setQty(product.slug, qty - 1)}
                            aria-label="Diminuir quantidade"
                            className="px-2 py-1.5 text-ivory hover:text-gold"
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm text-ivory">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty(product.slug, qty + 1)}
                            aria-label="Aumentar quantidade"
                            className="px-2 py-1.5 text-ivory hover:text-gold"
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-ivory">
                            {formatBRL(product.price * qty)}
                          </span>
                          <button
                            onClick={() => remove(product.slug)}
                            aria-label="Remover item"
                            className="text-ivory-soft transition-colors hover:text-wine"
                          >
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gold/30 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.2em] text-ivory-soft">
                  Subtotal
                </span>
                <span className="font-serif text-2xl text-ivory">
                  {formatBRL(subtotal)}
                </span>
              </div>
              <p className="mb-4 text-center text-xs text-ivory-soft">
                Frete calculado na finalização conforme seu CEP.
              </p>
              <Link href="/checkout" onClick={closeCart} className="btn-gold w-full">
                Finalizar Compra
              </Link>
            <Link
              href="/carrinho"
              onClick={closeCart}
              className="mb-2 block w-full border border-gold/50 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-ink"
            >
              Ver Carrinho
            </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
