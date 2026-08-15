"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { products, type Product } from "@/lib/products";
import ProductCardPromo from "@/components/ProductCardPromo";
import Ornament from "@/components/Ornament";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/icons";

type Category = "Masculino" | "Feminino";

const slides: {
  key: Category;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
}[] = [
  {
    key: "Masculino",
    eyebrow: "Os Mais Vendidos",
    title: "Perfumes Masculinos que Marcam Presença",
    subtitle:
      "Fragrâncias elogiadas e aprovadas por todos: amadeiradas, frescas e com rastro intenso.",
    cta: "Ver todos os masculinos",
  },
  {
    key: "Feminino",
    eyebrow: "Os Mais Vendidos",
    title: "Perfumes Femininos Inesquecíveis",
    subtitle:
      "Os queridinhos das nossas clientes: doces, florais e irresistíveis para todas as ocasiões.",
    cta: "Ver todas as femininas",
  },
];

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
      setActive((prev) => (prev + 1) % slides.length);
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

  const slide = slides[active];

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

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <div key={slide.key} className="animate-fade-up lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="text-center text-ivory lg:text-left">
            <Ornament light className="mb-8 lg:mb-12" />
            <p className="eyebrow lg:mb-4">{slide.eyebrow}</p>
            <h1 className="mt-4 font-serif text-3xl lg:text-4xl lg:leading-tight lg:tracking-tighter">
              {slide.title}
            </h1>
            <p className="mt-6 text-lg text-ivory/70 lg:mt-8 lg:max-w-xl lg:text-base">
              {slide.subtitle}
            </p>
            <Link
              href={`/produtos/categoria/${slide.key.toLowerCase()}`}
              className="btn-gold mt-8"
            >
              {slide.cta}
            </Link>
            <p className="mt-10 text-[10px] uppercase tracking-[0.35em] text-ivory/50">
              ★ 4,8 de avaliação · +2.000 clientes
            </p>
          </div>

          <div className="mt-12 lg:mt-0">
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {topByCategory(slide.key).map((product, i) => (
                <ProductCardPromo
                  key={product.slug}
                  product={product}
                  position={i + 1}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 lg:mt-16">
          <button
            onClick={() => goTo((active + slides.length - 1) % slides.length)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory transition-colors hover:bg-gold hover:text-ivory"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.key}
                onClick={() => goTo(idx)}
                aria-label={`Ir para ${s.key}`}
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
            onClick={() => goTo((active + 1) % slides.length)}
            aria-label="Próximo"
            className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory transition-colors hover:bg-gold hover:text-ivory"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
