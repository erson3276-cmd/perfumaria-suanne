"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Ornament from "@/components/Ornament";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/icons";

const slides = [
  {
    key: "Feminino",
    eyebrow: "Mais Vendidos",
    title: "Melhores Perfumes Femininos",
    subtitle:
      "Os queridinhos entre as nossas clientes: doces, florais e irresistíveis.",
    image: "/perfumes/yara-candy.jpg",
  },
  {
    key: "Masculino",
    eyebrow: "Mais Vendidos",
    title: "Melhores Perfumes Masculinos",
    subtitle:
      "Fragrâncias marcantes para ele: amadeiradas, aromáticas e intensas.",
    image: "/perfumes/asad.jpg",
  },
];

function bestSellers(category: string) {
  return products
    .filter((p) => p.category === category)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, 4);
}

export default function BestSellers() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
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

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-12 text-center">
        <Ornament className="mb-5" />
        <p className="eyebrow">Os Queridinhos da Casa</p>
        <h2 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">
          Mais Vendidos
        </h2>

        <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.key}
              onClick={() => goTo(idx)}
              aria-pressed={active === idx}
              className={`border px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                active === idx
                  ? "border-gold bg-gradient-to-b from-gold-light to-gold text-ink shadow-[0_8px_20px_-8px_rgba(168,132,47,0.6)]"
                  : "border-gold/40 text-ivory-soft hover:border-gold hover:text-gold"
              }`}
            >
              {s.key}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${active * 50}%)` }}
          >
            {slides.map((s, idx) => (
              <div key={s.key} className="w-full shrink-0">
                <div
                  className={`transition-opacity duration-700 ${
                    idx === active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Link
                    href={`/produtos/categoria/${s.key.toLowerCase()}`}
                    className="group relative block overflow-hidden border border-gold/25 bg-ink"
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      className="object-contain object-right pr-4 opacity-90 transition-transform duration-700 group-hover:scale-105 sm:pr-12"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/55 to-ink/15" />
                    <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14">
                      <p className="eyebrow text-ivory/80">{s.eyebrow}</p>
                      <h3 className="mt-2 font-serif text-3xl text-ivory sm:text-4xl">
                        {s.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm text-ivory/75">
                        {s.subtitle}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 border border-gold/60 bg-ink/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-gold-pale backdrop-blur-sm transition-colors group-hover:bg-gold group-hover:text-ink">
                        Ver todos
                        <IconChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>

                  <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                    {bestSellers(s.key).map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => goTo((active + slides.length - 1) % slides.length)}
          aria-label="Anterior"
          className="absolute -left-2 top-1/3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-gold/40 bg-surface text-ivory transition-colors hover:bg-gold hover:text-ink lg:flex"
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => goTo((active + 1) % slides.length)}
          aria-label="Próximo"
          className="absolute -right-2 top-1/3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-gold/40 bg-surface text-ivory transition-colors hover:bg-gold hover:text-ink lg:flex"
        >
          <IconChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
