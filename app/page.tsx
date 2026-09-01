import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getFeaturedProducts,
  products,
  categories,
} from "@/lib/products";
import { site } from "@/lib/site";
import ProductCard from "@/components/ProductCard";
import Ornament from "@/components/Ornament";
import BestSellers from "@/components/BestSellers";
import HeroBanners from "@/components/HeroBanners";
import {
  IconArrowRight,
  IconGift,
  IconShield,
  IconSpray,
  IconTruck,
  IconWhatsapp,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Perfumes Importados e Árabes de Luxo",
  description:
    "Perfumaria Suanne: perfumes importados e árabes de luxo, 100% originais, com frete grátis acima de R$ 300 e envio para todo o Brasil com rastreio.",
};

const categoryImages: Record<string, string> = {
  Feminino: "/perfumes/yara-candy.jpg",
  Masculino: "/perfumes/asad.jpg",
  Unissex: "/perfumes/khamrah.jpg",
};

const trustItems = [
  {
    icon: IconTruck,
    title: "Frete Grátis",
    text: "Para todo o Brasil em compras acima de R$ 300",
  },
  {
    icon: IconShield,
    title: "100% Original",
    text: "Importação direta, com selo de garantia",
  },
  {
    icon: IconGift,
    title: "Embalagem Presente",
    text: "Aperfeiçoada para presentear",
  },
  {
    icon: IconSpray,
    title: "Curadoria Árabe",
    text: "Essências raras selecionadas a dedo",
  },
];

const testimonials = [
  {
    name: "Mariana A.",
    text: "O perfume chegou em uma embalagem linda, digna de presente. A fragrância é exatamente como descrita. Virei cliente fiel!",
  },
  {
    name: "Rafael C.",
    text: "Atendimento impecável pelo WhatsApp. Comprei o Noir Absolu e recebi em 3 dias. Qualidade de loja internacional.",
  },
  {
    name: "Fernanda L.",
    text: "Comprei o cofre de desejos para o aniversário da minha mãe. Ela amou! Embalagem de outro nível.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      <HeroBanners />

      <div className="bg-gold text-ink">
        <div className="mx-auto max-w-7xl px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.25em] sm:text-xs">
          ✦ Frete grátis para todo o Brasil em compras acima de R$ 300 ✦
        </div>
      </div>

      <div className="border-y border-gold/20 bg-ink py-4 text-center text-ivory">
        <p className="px-4 text-[11px] uppercase tracking-[0.3em] text-ivory/85">
          ★ 4,8 de avaliação média · Mais de 2.000 clientes · Curadoria
          exclusiva de perfumes árabes
        </p>
      </div>

      <section className="border-b border-gold/20 bg-cream">
        <div className="mx-auto grid max-w-7xl divide-y divide-gold/20 px-5 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:px-8">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-4 px-2 py-6 sm:px-6 lg:py-10">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center border border-gold/40 text-gold transition-colors duration-300 hover:bg-gold hover:text-ivory">
                <item.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ivory">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-ivory-soft">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <Ornament className="mb-5" />
          <p className="eyebrow">Curadoria Exclusiva</p>
          <h2 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">
            Os Favoritos da Suanne
          </h2>
          <Link
            href="/produtos"
            className="link-line mt-5 inline-block text-sm uppercase tracking-[0.2em] text-gold"
          >
            Ver todos os perfumes
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <BestSellers />

      <section className="bg-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <Ornament className="mb-5" />
            <p className="eyebrow">Encontre sua Essência</p>
            <h2 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">
              Nossas Coleções
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const count = products.filter(
                (p) => p.category === cat
              ).length;
              return (
                <Link
                  key={cat}
                  href={`/produtos/categoria/${cat.toLowerCase()}`}
                  className="group relative block aspect-[3/4] overflow-hidden border border-gold/20 bg-ink transition-all duration-500 hover:border-gold"
                >
                  <Image
                    src={categoryImages[cat]}
                    alt={`Perfumes ${cat}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  <span className="absolute right-4 top-4 border border-gold/50 bg-ink/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-pale backdrop-blur-sm">
                    {count} {count === 1 ? "perfume" : "perfumes"}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="flex items-center justify-between font-serif text-2xl text-ivory">
                      {cat}
                      <IconArrowRight className="h-5 w-5 text-gold transition-transform duration-300 group-hover:translate-x-1" />
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/25 bg-ink">
            <Image
              src="/perfumes/khamrah.jpg"
              alt="Ateliê Perfumaria Suanne"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>
          <div>
            <Ornament className="mb-6 justify-start" />
            <p className="eyebrow">Nossa História</p>
            <h2 className="mt-3 font-serif text-3xl leading-snug text-ivory sm:text-4xl">
              Uma curadoria feita com{" "}
              <span className="gold-text italic">amor</span> e bom gosto
            </h2>
            <p className="mt-5 leading-relaxed text-ivory-soft">
              Cada frasco é selecionado a dedo por nossa equipe. Buscamos
              fragrâncias que contam histórias, que marcam presença e que se
              tornam parte da sua identidade.
            </p>
            <p className="mt-3 leading-relaxed text-ivory-soft">
              Trabalhamos com importadores certificados e garantimos a
              autenticidade de cada essência. Do ateliê até a sua porta.
            </p>
            <Link href="/sobre" className="btn-gold mt-8">
              Conheça a Marca
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <Ornament className="mb-5" />
            <p className="eyebrow">Quem Compra, Recomenda</p>
            <h2 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">
              Depoimentos
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="relative flex flex-col border border-gold/25 bg-surface p-8 transition-shadow duration-300 hover:shadow-[0_20px_40px_-20px_rgba(168,132,47,0.35)]"
              >
                <span className="absolute -top-5 left-7 flex h-10 w-10 items-center justify-center bg-gold font-serif text-2xl leading-none text-ivory">
                  “
                </span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ivory-soft">
                  {t.text}
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-gold/15 pt-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-serif text-gold">
                    {t.name[0]}
                  </span>
                  <span className="text-sm uppercase tracking-[0.18em] text-ivory">
                    {t.name}
                  </span>
                  <span className="ml-auto text-xs text-gold">★★★★★</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-24 text-center text-ivory">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #c9a84e 0, transparent 40%), radial-gradient(circle at 80% 70%, #c9a84e 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-2xl px-5">
          <Ornament light className="mb-6" />
          <p className="eyebrow">Atendimento Personalizado</p>
          <h2 className="mt-3 font-serif text-3xl leading-snug sm:text-4xl">
            Não sabe qual perfume escolher?
          </h2>
          <p className="mt-4 text-ivory/70">
            Fale com a nossa equipe no WhatsApp e receba uma indicação
            personalizada de acordo com o seu estilo e a sua ocasião.
          </p>
          <a
            href={`https://wa.me/${site.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline mt-8"
          >
            <IconWhatsapp className="h-4 w-4" />
            Tirar Dúvidas no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
