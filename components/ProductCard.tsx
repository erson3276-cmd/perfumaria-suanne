"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/site";
import type { Product } from "@/lib/products";
import ProductImage from "@/components/ProductImage";
import Rating from "@/components/Rating";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  return (
    <article className="group relative flex flex-col bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_45px_-22px_rgba(0,0,0,0.6)]">
      {product.badge && (
        <span className="absolute left-0 top-0 z-10 bg-gradient-to-r from-ink to-ink/90 px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold-pale">
          {product.badge}
        </span>
      )}
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          className="object-contain transition-transform duration-700 group-hover:scale-105"
        />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15" />
      </Link>

      <div className="flex flex-1 flex-col border-t border-gold/15 px-4 pt-4 pb-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.28em] text-gold">
            {product.brand}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-ivory-soft/70">
            {product.size}
          </span>
        </div>
        <Link href={`/produtos/${product.slug}`}>
          <h3 className="mt-1.5 font-serif text-lg leading-snug text-ivory transition-colors hover:text-gold">
            {product.name}
          </h3>
        </Link>
        <Rating rating={product.rating} reviews={product.reviews} className="mt-2" />

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            {hasDiscount && (
              <span className="block text-xs text-ivory-soft/70 line-through">
                {formatBRL(product.originalPrice!)}
              </span>
            )}
            <span className="font-serif text-xl text-ivory">
              {formatBRL(product.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => add(product.slug)}
            disabled={!product.inStock}
            className={`border px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 ${
              product.inStock
                ? "border-gold text-gold hover:bg-gold hover:text-ink"
                : "cursor-not-allowed border-ivory-soft/30 text-ivory-soft/40"
            }`}
          >
            {product.inStock ? "Adicionar" : "Esgotado"}
          </button>
        </div>
      </div>
    </article>
  );
}
