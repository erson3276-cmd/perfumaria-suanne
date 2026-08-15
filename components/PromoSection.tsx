import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCardPromo from "@/components/ProductCardPromo";
import { IconArrowRight } from "@/components/icons";

type Props = {
  emoji: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  products: Product[];
  href: string;
};

export default function PromoSection({
  emoji,
  eyebrow,
  title,
  subtitle,
  products,
  href,
}: Props) {
  return (
    <section className="border-b border-gold/15 bg-cream/60 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
              <span className="mr-2">{emoji}</span>
              {title}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
          </div>
          <Link
            href={href}
            className="link-line hidden shrink-0 items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold sm:inline-flex"
          >
            Ver todos
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 sm:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <div
              key={p.slug}
              className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]"
            >
              <ProductCardPromo product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
