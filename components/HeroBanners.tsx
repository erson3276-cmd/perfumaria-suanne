"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@/components/icons";

const banners = [
  { key: "Masculino", src: "/banners/banner-masculino.jpg", alt: "Banner Top 5 Masculino" },
  { key: "Feminino", src: "/banners/banner-feminino.jpg", alt: "Banner Top 5 Feminino" },
] as const;

export default function HeroBanners() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
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

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative aspect-[1744/608] w-full overflow-hidden border border-gold/25 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          {banners.map((b, idx) => (
            <div
              key={b.key}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={b.src}
                alt={b.alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => goTo((active + banners.length - 1) % banners.length)}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory transition-colors hover:bg-gold hover:text-ink"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            {banners.map((b, idx) => (
              <button
                key={b.key}
                onClick={() => goTo(idx)}
                aria-label={`Ir para ${b.key}`}
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
            onClick={() => goTo((active + 1) % banners.length)}
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
