import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";
import Ornament from "@/components/Ornament";
import { IconInstagram, IconWhatsapp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Perfumaria Suanne pelo WhatsApp ou e-mail. Atendimento personalizado de segunda a sexta. Compre perfumes importados e árabes com segurança.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  return (
    <div>
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-8">
          <Ornament className="mb-5" />
          <p className="eyebrow">Fale Conosco</p>
          <h1 className="mt-3 font-serif text-3xl text-ink sm:text-5xl">
            Estamos prontos para ajudar
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
            Dúvidas sobre fragrâncias, pedidos ou trocas? Nossa equipe responde
            rapidinho.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href={whatsappLink("Olá! Gostaria de falar com a Perfumaria Suanne.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 border border-gold/30 bg-ivory p-7 transition-colors hover:border-gold"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-ivory">
              <IconWhatsapp className="h-7 w-7" />
            </span>
            <span>
              <span className="block font-serif text-xl text-ink">
                WhatsApp
              </span>
              <span className="mt-1 block text-sm text-ink-soft">
                {site.phone} · resposta em minutos
              </span>
            </span>
          </a>

          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 border border-gold/30 bg-ivory p-7 transition-colors hover:border-gold"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-ivory">
              <IconInstagram className="h-7 w-7" />
            </span>
            <span>
              <span className="block font-serif text-xl text-ink">
                Instagram
              </span>
              <span className="mt-1 block text-sm text-ink-soft">
                @suannechagas
              </span>
            </span>
          </a>

          <a
            href={`mailto:${site.email}`}
            className="group flex items-center gap-5 border border-gold/30 bg-ivory p-7 transition-colors hover:border-gold sm:col-span-2"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-ivory">
              <span className="font-serif text-xl">✉</span>
            </span>
            <span>
              <span className="block font-serif text-xl text-ink">
                E-mail
              </span>
              <span className="mt-1 block text-sm text-ink-soft">
                {site.email} · respondemos em até 24h úteis
              </span>
            </span>
          </a>
        </div>

        <div className="mt-10 border border-gold/30 bg-cream p-8 text-center">
          <p className="eyebrow">Atendimento</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">
            Horário de funcionamento
          </h2>
          <p className="mt-3 text-sm text-ink-soft">
            Segunda a sexta, das 9h às 18h.
            <br />
            {site.address}
          </p>
        </div>
      </section>
    </div>
  );
}
