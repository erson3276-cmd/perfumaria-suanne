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
    <section className="relative w-full overflow-hidden bg-ink">
      <div className="relative aspect-[5/2] w-full sm:aspect-[3/1]">
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
              sizes="100vw"
              className="object-cover object-center"
              priority={idx === 0}
              quality={90}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
      </div>

      <button
        onClick={() => goTo((active + banners.length - 1) % banners.length)}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ivory/30 bg-ink/50 text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:left-6"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => goTo((active + 1) % banners.length)}
        aria-label="Próximo"
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-ivory/30 bg-ink/50 text-ivory backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:right-6"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {banners.map((b, idx) => (
          <button
            key={b.key}
            onClick={() => goTo(idx)}
            aria-label={`Ir para ${b.key}`}
            aria-pressed={active === idx}
            className={`h-2 border transition-all duration-300 ${
              active === idx
                ? "w-8 border-gold bg-gold"
                : "w-2 border-ivory/50 bg-transparent hover:border-gold"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
