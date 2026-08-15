"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { products, type Product } from "@/lib/products";
import ProductCardPromo from "@/components/ProductCardPromo";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/icons";

type Category = "Masculino" | "Feminino";

const categories: Category[] = ["Masculino", "Feminino"];

function topByCategory(category: Category): Product[] {
  return products
    .filter((p) => p.category === category)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 3);
}

export default function HeroBanners() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % categories.length);
    }, 8000);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  const goTo = (index: number) => {
    setActive(index);
    restartTimer();
  };

  const slide = categories[active];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(201,168,78,0.15), transparent 40%), radial-gradient(circle at 90% 90%, rgba(201,168,78,0.12), transparent 45%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div key={slide} className="animate-fade-up">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {topByCategory(slide).map((product, i) => (
              <ProductCardPromo
                key={product.slug}
                product={product}
                position={i + 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 lg:mt-16">
          <button
            onClick={() => goTo((active + categories.length - 1) % categories.length)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            {categories.map((c, idx) => (
              <button
                key={c}
                onClick={() => goTo(idx)}
                aria-label={`Ir para ${c}`}
                aria-pressed={active === idx}
                className={`h-2.5 border transition-all duration-300 ${
                  active === idx
                    ? "w-10 border-gold bg-gold"
                    : "w-2.5 border-ivory/40 bg-transparent hover:border-gold"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo((active + 1) % categories.length)}
            aria-label="Próximo"
            className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
