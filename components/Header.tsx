"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import {
  IconCart,
  IconClose,
  IconMenu,
  IconSearch,
  IconTruck,
  IconWhatsapp,
} from "@/components/icons";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Perfumes" },
  { href: "/sobre", label: "A Marca" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-[10px] uppercase tracking-[0.25em] lg:px-8">
          <p className="flex items-center gap-2 text-ivory/75">
            <IconTruck className="h-3.5 w-3.5 text-gold" />
            <span className="hidden sm:inline">Envio para todo o Brasil</span>
            <span className="sm:hidden">Enviamos para todo o Brasil</span>
          </p>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ivory/75 transition-colors hover:text-gold-light"
          >
            <IconWhatsapp className="h-3.5 w-3.5 text-gold" />
            {site.phone}
          </a>
        </div>
      </div>

      <div className="border-b border-gold/25 bg-ivory/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div className="flex flex-1 items-center gap-4">
            <button
              className="text-ink lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menu"
            >
              {menuOpen ? (
                <IconClose className="h-6 w-6" />
              ) : (
                <IconMenu className="h-6 w-6" />
              )}
            </button>
            <nav className="hidden items-center gap-9 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`link-line text-sm uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                    isActive(link.href)
                      ? "text-gold after:w-full"
                      : "text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo Perfumaria Suanne"
              width={48}
              height={48}
              className="h-11 w-11 rounded-full object-cover"
            />
            <span className="text-left">
              <span className="block font-serif text-xl leading-none tracking-wide text-ink sm:text-2xl">
                Perfumaria <span className="gold-text">Suanne</span>
              </span>
              <span className="mt-1.5 hidden text-[10px] uppercase tracking-[0.45em] text-gold sm:block">
                ✦ {site.tagline} ✦
              </span>
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-5">
            <Link
              href="/produtos"
              aria-label="Buscar perfumes"
              className="text-ink transition-colors hover:text-gold"
            >
              <IconSearch className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              aria-label="Abrir carrinho"
              className="relative text-ink transition-colors hover:text-gold"
            >
              <IconCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ivory">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="hidden items-center justify-center gap-6 border-t border-gold/15 py-3 lg:flex">
          {categories.map((cat, idx) => (
            <span key={cat} className="flex items-center gap-6">
              {idx > 0 && <span className="text-[9px] text-gold">✦</span>}
              <Link
                href={`/produtos/categoria/${cat.toLowerCase()}`}
                className="text-xs uppercase tracking-[0.28em] text-ink-soft transition-colors hover:text-gold"
              >
                {cat}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <div className="border-b border-gold/25 bg-ivory lg:hidden">
          <nav className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-gold/15 py-3 text-sm uppercase tracking-[0.18em] ${
                  isActive(link.href) ? "text-gold" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/produtos/categoria/${cat.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-gold"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
