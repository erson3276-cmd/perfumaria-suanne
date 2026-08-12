"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Ornament from "@/components/Ornament";
import { IconClose, IconSearch } from "@/components/icons";

type Sort = "relevancia" | "menor" | "maior" | "avaliacao";

const sortLabels: Record<Sort, string> = {
  relevancia: "Relevância",
  menor: "Menor preço",
  maior: "Maior preço",
  avaliacao: "Melhor avaliados",
};

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("categoria") ?? "Todos";
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("relevancia");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchCategory =
        activeCategory === "Todos" || p.category === activeCategory;
      const matchQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.notes.top.some((n) => n.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });

    switch (sort) {
      case "menor":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "maior":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "avaliacao":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [query, activeCategory, sort]);

  return (
    <div>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center lg:px-8">
          <Ornament className="mb-5" />
          <p className="eyebrow">Perfumaria Suanne</p>
          <h1 className="mt-3 font-serif text-3xl text-ink sm:text-5xl">
            {activeCategory === "Todos"
              ? "Todos os Perfumes"
              : `Perfumes ${activeCategory}`}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Fragrâncias de luxo selecionadas para cada personalidade. Encontre
            a essência que fala por você.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["Todos", ...categories].map((cat) => {
              const active = activeCategory === cat;
              const count =
                cat === "Todos"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <a
                  key={cat}
                  href={`/produtos?categoria=${encodeURIComponent(cat)}`}
                  className={`border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300 ${
                    active
                      ? "border-gold bg-gradient-to-b from-gold-light to-gold text-ivory shadow-[0_8px_20px_-8px_rgba(168,132,47,0.6)]"
                      : "border-gold/40 text-ink-soft hover:border-gold hover:text-gold"
                  }`}
                >
                  {cat} <span className="opacity-60">({count})</span>
                </a>
              );
            })}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-xs">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, marca ou nota..."
                className="input-lux pl-9"
                aria-label="Buscar perfumes"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                  aria-label="Limpar busca"
                >
                  <IconClose className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                {filtered.length} {filtered.length === 1 ? "perfume" : "perfumes"}
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="input-lux w-auto cursor-pointer"
                aria-label="Ordenar por"
              >
                {(Object.keys(sortLabels) as Sort[]).map((key) => (
                  <option key={key} value={key}>
                    {sortLabels[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-ink">
              Nenhum perfume encontrado
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              Tente ajustar a busca ou escolha outra categoria.
            </p>
            <Link href="/produtos" className="btn-gold mt-6">
              Ver todos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
