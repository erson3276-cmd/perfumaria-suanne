import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Ornament from "@/components/Ornament";
import {
  IconGift,
  IconShield,
  IconSpray,
  IconTruck,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Sobre Nossa História",
  description:
    "Conheça a história da Perfumaria Suanne e o cuidado com cada essência selecionada a dedo: perfumes importados e árabes de luxo, 100% originais.",
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <div>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-8">
          <Ornament className="mb-5" />
          <p className="eyebrow">Nossa História</p>
          <h1 className="mt-3 font-serif text-3xl text-ivory sm:text-5xl">
            Uma perfumaria com alma
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/25 bg-ink">
            <Image
              src="/perfumes/amber-rouge.png"
              alt="Ateliê da Perfumaria Suanne"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl leading-snug text-ivory">
              O perfume é a assinatura invisível de cada pessoa
            </h2>
            <p className="mt-5 leading-relaxed text-ivory-soft">
              A Perfumaria Suanne nasceu da paixão por essências raras e bem
              elaboradas. Começamos com uma pequena curadoria e hoje levamos
              fragrâncias de luxo para todo o Brasil, sempre com o mesmo
              cuidado: escolher cada frasco como se fosse um presente para
              alguém especial.
            </p>
            <p className="mt-3 leading-relaxed text-ivory-soft">
              Trabalhamos com importadores certificados, garantimos
              autenticidade e cuidamos de cada detalhe — da embalagem ao
              rastreio — para que a experiência de comprar seja tão
              memorável quanto o próprio perfume.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/20 bg-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            {
              icon: IconSpray,
              title: "Curadoria a dedo",
              text: "Cada fragrância é testada e aprovada pela nossa equipe antes de entrar na vitrine.",
            },
            {
              icon: IconShield,
              title: "Autenticidade",
              text: "Importação direta de laboratórios certificados, com garantia de originalidade.",
            },
            {
              icon: IconTruck,
              title: "Entrega caprichada",
              text: "Envio com rastreio e embalagem segura para todo o território nacional.",
            },
            {
              icon: IconGift,
              title: "Atendimento humano",
              text: "Indicação personalizada e suporte real antes e depois da compra.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <item.icon className="mx-auto h-10 w-10 text-gold" />
              <h3 className="mt-4 font-serif text-lg text-ivory">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory-soft">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center lg:px-8">
        <Ornament className="mb-5" />
        <p className="eyebrow">Visite nossa coleção</p>
        <h2 className="mt-2 font-serif text-3xl text-ivory sm:text-4xl">
          Deixe sua assinatura olfativa
        </h2>
        <p className="mt-4 text-ivory-soft">
          Descubra os perfumes mais amados pelos nossos clientes.
        </p>
        <Link href="/produtos" className="btn-gold mt-8">
          Explorar Coleção
        </Link>
      </section>
    </div>
  );
}
