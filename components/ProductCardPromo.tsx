"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL, pixPrice } from "@/lib/site";
import type { Product } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCardPromo({
  product,
  position,
}: {
  product: Product;
  position?: number;
}) {
  const { add } = useCart();
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : null;
  const pix = pixPrice(product.price);
  const parcel = product.price / 10;

  return (
    <article className="group flex h-full flex-col bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(25,19,16,0.35)]">
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="object-contain p-2 transition-transform duration-700 group-hover:scale-105 sm:p-3"
        />
        {position ? (
          <span className="absolute left-0 top-0 bg-gradient-to-r from-gold to-gold-light px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-ivory">
            {position}º Mais Vendido
          </span>
        ) : (
          product.badge && (
            <span className="absolute left-0 top-0 bg-ink px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-gold-pale">
              {product.badge}
            </span>
          )
        )}
        {discountPct && (
          <span className="absolute right-0 top-0 bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-ivory">
            {discountPct}% OFF
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col border-t border-gold/15 p-3 sm:p-4">
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.6em] font-serif text-sm leading-snug text-ink transition-colors hover:text-gold">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-serif text-lg font-semibold text-ink">
              {formatBRL(pix)}
            </span>
            <span className="text-[11px] text-ink-soft">no pix</span>
            {hasDiscount && (
              <span className="text-xs text-ink-soft/60 line-through">
                {formatBRL(product.originalPrice!)}
              </span>
            )}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-ink-soft">
            em até <strong>10x de {formatBRL(parcel)}</strong> sem juros
          </p>
        </div>

        <button
          type="button"
          onClick={() => add(product.slug)}
          disabled={!product.inStock}
          className={`mt-auto w-full border py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
            product.inStock
              ? "border-ink/15 text-ink hover:border-gold hover:bg-gold hover:text-ivory"
              : "cursor-not-allowed border-ink-soft/20 text-ink-soft/40"
          }`}
        >
          {product.inStock ? "Comprar" : "Esgotado"}
        </button>
      </div>
    </article>
  );
}
