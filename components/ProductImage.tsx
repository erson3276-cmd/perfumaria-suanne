"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ProductImage({
  src,
  alt,
  className = "object-contain",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-ink via-ink-soft to-gold ${className ?? ""}`}
      >
        <span className="font-serif text-ivory/80 uppercase tracking-[0.3em] text-sm px-6 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
