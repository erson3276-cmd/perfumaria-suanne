"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, type Product } from "@/lib/products";
import {
  IconChevronLeft,
  IconChevronRight,
  IconTruck,
  IconShield,
  IconSpray,
  IconGift,
} from "@/components/icons";

type Category = "Masculino" | "Feminino";

const categories: Category[] = ["Masculino", "Feminino"];

const topSlugs: Record<Category, string[]> = {
  Feminino: [
    "sabah-al-ward",
    "durrat-al-aroos",
    "yara-candy",
    "ana-abiyedh-rouge",
    "afeef",
  ],
  Masculino: [
    "asad",
    "khamrah",
    "fakhar-black",
    "attar-al-wesal",
    "ana-abiyedh-rouge",
  ],
};

function topPicks(category: Category): Product[] {
  return topSlugs[category]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}

const pillars = [
  { icon: IconShield, label: "100% Originais" },
  { icon: IconSpray, label: "Importação Oficial" },
  { icon: IconTruck, label: "Envio Rápido" },
  { icon: IconGift, label: "Garantia de Autenticidade" },
];

function ArabArch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 200"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M50 8 C 20 30, 10 80, 12 140 C 13 190, 30 196, 50 196 C 70 196, 87 190, 88 140 C 90 80, 80 30, 50 8 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <path
        d="M50 22 C 28 40, 21 82, 23 138 C 24 178, 36 184, 50 184 C 64 184, 76 178, 77 138 C 79 82, 72 40, 50 22 Z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
      />
    </svg>
  );
}

export default function HeroBanners() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % categories.length);
    }, 9000);
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
  const picks = topPicks(slide);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 18%, rgba(201,168,78,0.16), transparent 42%), radial-gradient(circle at 92% 88%, rgba(201,168,78,0.12), transparent 46%), radial-gradient(circle at 75% 8%, rgba(255,255,255,0.05), transparent 30%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/50" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />

      <ArabArch className="pointer-events-none absolute -left-8 top-8 hidden h-[420px] w-[210px] text-gold lg:block" />
      <ArabArch className="pointer-events-none absolute -right-8 top-8 hidden h-[420px] w-[210px] text-gold lg:block" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div key={slide} className="animate-fade-up">
          <div className="mb-6 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              A Perfumaria Suanne
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              <span className="gold-metallic block">TOP 5</span>
              <span className="mt-2 block font-sans text-lg uppercase tracking-[0.25em] text-ivory sm:text-xl">
                Mais Vendidos · {slide}
              </span>
            </h2>
            <div className="mx-auto mt-5 flex max-w-md items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl">
            <div className="flex items-end justify-center gap-1 sm:gap-3">
              {picks.map((p, i) => (
                <div
                  key={p.slug}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  <Link
                    href={`/produtos/${p.slug}`}
                    className="group relative h-40 w-full transition-transform duration-300 hover:-translate-y-1 sm:h-56 lg:h-64"
                  >
                    <Image
                      src={`/perfumes/cutouts/${p.slug}.png`}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1280px) 20vw, 220px"
                      className="object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 font-serif text-sm text-gold-pale/90 sm:text-base">
                      {i + 1}º
                    </span>
                  </Link>
                  <Link
                    href={`/produtos/${p.slug}`}
                    className="mt-2 block max-w-full truncate font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-ivory transition-colors hover:text-gold sm:text-xs"
                  >
                    {p.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="relative mt-1">
              <div className="absolute inset-x-0 -top-px h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="h-12 rounded-b-2xl bg-gradient-to-b from-sand to-ink sm:h-16" />
              <div className="absolute inset-x-6 bottom-0 h-px bg-gold/40 sm:inset-x-10" />
              <div className="absolute inset-x-10 bottom-1.5 h-px bg-gold/20 sm:inset-x-16" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <span className="inline-flex items-center gap-2 border border-gold/60 bg-gold/10 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-gold-pale backdrop-blur-sm">
              <IconShield className="h-4 w-4" />
              Parcele em até 10x sem juros
            </span>
            <Link
              href={`/produtos/categoria/${slide.toLowerCase()}`}
              className="btn-outline"
            >
              Ver todos
            </Link>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
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

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-4 border-t border-gold/20 pt-6 sm:grid-cols-4">
          {pillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 sm:flex-col sm:gap-1.5"
            >
              <Icon className="h-5 w-5 shrink-0 text-gold" />
              <span className="text-center text-[10px] uppercase tracking-[0.1em] text-ivory-soft">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
