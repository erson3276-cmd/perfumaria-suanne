"use client";

import { useEffect, useState } from "react";

type StockDisplayProps = {
  olistId: number;
};

export default function StockDisplay({ olistId }: StockDisplayProps) {
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch("/api/stock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: olistId }),
        });
        const data = await res.json();
        if (res.ok) setStock(data.stock);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStock();
  }, [olistId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ivory-soft/50">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold/40" />
        Verificando estoque…
      </div>
    );
  }

  if (stock === null) return null;

  if (stock <= 0) {
    return (
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-wine">
        <span className="inline-block h-2 w-2 rounded-full bg-wine" />
        Esgotado
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold" />
        Últimas {stock} unidades!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ivory-soft">
      <span className="inline-block h-2 w-2 rounded-full bg-gold/60" />
      Em estoque ({stock} unidades)
    </div>
  );
}
