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
    <div className={`border border-gold/25 bg-surface p-4 ${className}`}>
      <p className="flex items-center gap-2 font-serif text-lg text-ivory">
        <IconTruck className="h-5 w-5 text-gold" />
        Frete
      </p>

      {free ? (
        <p className="mt-3 border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
          Frete <strong>grátis</strong> para todo o Brasil.
        </p>
      ) : (
        <div className="mt-3">
          <p className="text-sm text-ivory">
            Frete fixo de{" "}
            <span className="font-numeral text-base">{formatBRL(fee)}</span>{" "}
            para todo o Brasil.
          </p>
          <p className="mt-2 text-xs text-ivory-soft">
            Faltam <span className="font-medium text-ivory">{formatBRL(remaining)}</span>{" "}
            para você ganhar <strong className="text-ivory">frete grátis</strong>.
          </p>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-ivory-soft">
        Frete grátis para pedidos acima de {formatBRL(site.freeShippingAbove)}.
      </p>
    </div>
  );
}
