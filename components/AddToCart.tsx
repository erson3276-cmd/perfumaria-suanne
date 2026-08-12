"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/site";
import type { Product } from "@/lib/products";
import { IconMinus, IconPlus } from "@/components/icons";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      add(product.slug);
    }
  };

  if (!product.inStock) {
    return (
      <div className="mt-8">
        <p className="inline-block border border-wine/40 bg-wine/5 px-4 py-3 text-sm uppercase tracking-[0.15em] text-wine">
          Produto temporariamente esgotado
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-gold/40 bg-ivory">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="px-4 py-4 text-ink transition-colors hover:text-gold"
          >
            <IconMinus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-serif text-lg text-ink">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            aria-label="Aumentar quantidade"
            className="px-4 py-4 text-ink transition-colors hover:text-gold"
          >
            <IconPlus className="h-4 w-4" />
          </button>
        </div>
        <button onClick={handleAdd} className="btn-gold flex-1">
          Adicionar ao Carrinho · {formatBRL(product.price * qty)}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        Compra segura · Enviamos para todo o Brasil
      </p>
    </div>
  );
}
