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
        if (res.ok) {
          setStock(data.stock);
        }
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
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="animate-pulse h-2 w-2 bg-gray-300 rounded-full" />
        Verificando estoque...
      </div>
    );
  }

  if (stock === null) {
    return null;
  }

  if (stock <= 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="h-2 w-2 bg-red-500 rounded-full" />
        Esgotado
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
        Últimas {stock} unidades!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-green-600">
      <div className="h-2 w-2 bg-green-500 rounded-full" />
      Em estoque ({stock} unidades)
    </div>
  );
}
