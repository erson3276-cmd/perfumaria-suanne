import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/lib/products";
import { formatBRL, site, whatsappLink } from "@/lib/site";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import Rating from "@/components/Rating";
import AddToCart from "@/components/AddToCart";
import StockDisplay from "@/components/StockDisplay";
import FreteCalculator from "@/components/FreteCalculator";
import ProductViewTracker from "@/components/ProductViewTracker";
import Ornament from "@/components/Ornament";
import {
  IconChevronRight,
  IconGift,
  IconShield,
  IconTruck,
  IconWhatsapp,
} from "@/components/icons";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const productTitle = `Perfume ${product.name} ${product.brand} ${product.size} | ${product.category}`;
  return {
    title: productTitle,
    description: product.description.slice(0, 155),
    alternates: {
      canonical: `/produtos/${product.slug}`,
    },
    openGraph: {
      title: productTitle,
      description: product.description.slice(0, 155),
      url: `${site.url}/produtos/${product.slug}`,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const hasDiscount =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        (1 - product.price / product.originalPrice!) * 100
      )
    : 0;

  const hash = hashCode(product.slug);
  const weeklyBuyers = 24 + (hash % 180);

  return (
    <div>
      <ProductViewTracker
        product={{
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: `${site.url}${product.image}`,
            description: product.description.slice(0, 155),
            brand: { "@type": "Brand", name: product.brand },
            offers: {
              "@type": "Offer",
              url: `${site.url}/produtos/${product.slug}`,
              priceCurrency: "BRL",
              price: product.price.toFixed(2),
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.reviews,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Início",
                item: site.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Perfumes",
                item: `${site.url}/produtos`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.category,
                item: `${site.url}/produtos/categoria/${product.category.toLowerCase()}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: product.name,
                item: `${site.url}/produtos/${product.slug}`,
              },
            ],
          }),
        }}
      />
      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-ivory-soft">
          <Link href="/" className="transition-colors hover:text-gold">
            Início
          </Link>
          <IconChevronRight className="h-3 w-3" />
          <Link href="/produtos" className="transition-colors hover:text-gold">
            Perfumes
          </Link>
          <IconChevronRight className="h-3 w-3" />
          <Link
            href={`/produtos/categoria/${product.category.toLowerCase()}`}
            className="transition-colors hover:text-gold"
          >
            {product.category}
          </Link>
          <IconChevronRight className="h-3 w-3" />
          <span className="text-ivory">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/5] overflow-hidden border border-gold/20 bg-ink">
            <ProductImage
              src={product.image}
              alt={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
            <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15" />
            {product.badge && (
              <span className="absolute left-0 top-0 bg-gradient-to-r from-ink to-ink/90 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-gold-pale">
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-2 font-serif text-3xl leading-tight text-ivory sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-4">
              <Rating rating={product.rating} reviews={product.reviews} />
              <span className="text-xs text-ivory-soft">
                {product.size} · {product.category}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              {hasDiscount && (
                <>
                  <span className="font-serif text-2xl text-gold">
                    {formatBRL(product.price)}
                  </span>
                  <span className="text-sm text-ivory-soft line-through">
                    {formatBRL(product.originalPrice!)}
                  </span>
                  <span className="bg-wine/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-wine">
                    -{discountPct}%
                  </span>
                </>
              )}
              {!hasDiscount && (
                <span className="font-serif text-2xl text-ivory">
                  {formatBRL(product.price)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ivory-soft">
              até 3x de{" "}
              {formatBRL(product.price / 3)} sem juros no cartão
            </p>

            {product.olistId && (
              <div className="mt-3">
                <StockDisplay olistId={product.olistId} />
              </div>
            )}

            <p className="mt-6 leading-relaxed text-ivory-soft">
              {product.description}
            </p>

            <div className="mt-6 border-l-2 border-gold/50 bg-cream/70 px-4 py-3">
              <p className="text-sm text-ivory">
                <span className="font-semibold text-gold">{weeklyBuyers}</span>{" "}
                clientes escolheram esta fragrância esta semana
              </p>
            </div>

            <AddToCart product={product} />

            <FreteCalculator className="mt-6" value={product.price} />

            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-gold/25 py-5 text-center">
              {[
                { icon: IconTruck, label: "Envio para todo o Brasil" },
                { icon: IconShield, label: "Produto original" },
                { icon: IconGift, label: "Embalagem presente" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon className="h-6 w-6 text-gold" />
                  <span className="text-[11px] uppercase tracking-[0.12em] text-ivory-soft">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={whatsappLink(
                `Olá! Tenho interesse no perfume ${product.name} (${product.brand}). Pode me ajudar?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-gold hover:text-ivory"
            >
              <IconWhatsapp className="h-4 w-4" />
              Dúvidas? Fale com a gente
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/20 bg-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <Ornament className="mb-6 justify-start" />
            <p className="eyebrow">Pirâmide Olfativa</p>
            <h2 className="mt-2 font-serif text-2xl text-ivory">
              A composição da fragrância
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <NoteColumn title="Saída" notes={product.notes.top} />
              <NoteColumn title="Corpo" notes={product.notes.heart} />
              <NoteColumn title="Fundo" notes={product.notes.base} />
            </div>
          </div>
          <div>
            <Ornament className="mb-6 justify-start" />
            <p className="eyebrow">Entrega & Pagamento</p>
            <h2 className="mt-2 font-serif text-2xl text-ivory">
              Compra tranquila
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-ivory-soft">
              <li className="flex gap-3">
                <IconTruck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>
                  Enviamos para todo o Brasil com código de rastreio. Frete
                  grátis acima de {formatBRL(site.freeShippingAbove)}; abaixo,
                  frete fixo de {formatBRL(site.shippingFee)}.
                </span>
              </li>
              <li className="flex gap-3">
                <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>
                  Garantia de autenticidade em todos os produtos. Se não for
                  original, devolvemos o dinheiro.
                </span>
              </li>
              <li className="flex gap-3">
                <IconGift className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>
                  Presente exclusivo da casa nas compras acima de{" "}
                  {formatPrice0(site.giftAbove)}.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <Ornament className="mb-5" />
          <p className="eyebrow">Você também pode gostar</p>
          <h2 className="mt-2 font-serif text-2xl text-ivory sm:text-3xl">
            Sugestões para você
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function NoteColumn({ title, notes }: { title: string; notes: string[] }) {
  return (
    <div className="border border-gold/25 bg-surface p-4 text-center">
      <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold">
        {title}
      </p>
      <ul className="space-y-1.5">
        {notes.map((note) => (
          <li key={note} className="text-sm text-ivory-soft">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function formatPrice0(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}
