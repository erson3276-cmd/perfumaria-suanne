"use client";

import { formatBRL, shippingFor, site } from "@/lib/site";
import { IconTruck } from "@/components/icons";

export default function FreteCalculator({
  value = 0,
  className = "",
}: {
  value?: number;
  className?: string;
}) {
  const { free, fee, remaining } = shippingFor(value);

  return (
    <div className={`border border-gold/25 bg-white p-4 ${className}`}>
      <p className="flex items-center gap-2 font-serif text-lg text-ink">
        <IconTruck className="h-5 w-5 text-gold" />
        Frete
      </p>

      {free ? (
        <p className="mt-3 border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          Frete <strong>grátis</strong> para todo o Brasil.
        </p>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-ink">
            Frete fixo de{" "}
            <span className="font-serif text-base">{formatBRL(fee)}</span>{" "}
            para todo o Brasil.
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            Faltam <span className="font-medium text-ink">{formatBRL(remaining)}</span>{" "}
            para você ganhar <strong className="text-ink">frete grátis</strong>.
          </p>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">
        Frete grátis para pedidos acima de {formatBRL(site.freeShippingAbove)}.
      </p>
    </div>
  );
}
