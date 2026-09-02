import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import Ornament from "@/components/Ornament";
import { IconInstagram, IconWhatsapp } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="border-b border-ivory/10 py-16 text-center">
          <Image
            src="/logo.svg"
            alt="Logo Perfumaria Suanne"
            width={72}
            height={72}
            className="mx-auto h-16 w-16"
          />
          <p className="mt-4 font-serif text-3xl text-ivory sm:text-4xl">
            Perfumaria <span className="gold-text">Suanne</span>
          </p>
          <Ornament light className="mt-5" />
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ivory/60">
            Curadoria de perfumes importados e autorais. Essências de luxo para
            quem valoriza o que é raro e belo.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory/70 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <IconInstagram className="h-5 w-5" />
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory/70 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <IconWhatsapp className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">
              Navegação
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link href="/" className="transition-colors hover:text-gold">Início</Link></li>
              <li><Link href="/produtos" className="transition-colors hover:text-gold">Todos os Perfumes</Link></li>
              <li><Link href="/sobre" className="transition-colors hover:text-gold">A Marca</Link></li>
              <li><Link href="/contato" className="transition-colors hover:text-gold">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">
              Coleções
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/produtos/categoria/${cat.toLowerCase()}`}
                    className="transition-colors hover:text-gold"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">
              Atendimento
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold"
                >
                  WhatsApp: {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li className="leading-relaxed">{site.address}</li>
              <li className="pt-2 text-xs leading-relaxed text-ivory/50">
                Seg a Sex, 9h às 18h.
                <br />
                Pagamento via Pix e cartão (Mercado Pago).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs uppercase tracking-[0.3em] text-gold">
              Segurança
            </h3>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li>Produtos 100% originais</li>
              <li>Envio com código de rastreio</li>
              <li>Embalagem caprichada, pronta para presente</li>
              <li>Atendimento personalizado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center text-xs text-ivory/40 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos
            reservados.
            {site.cnpj && (
              <span className="block pt-1">
                {site.razaoSocial} · CNPJ {site.cnpj}
              </span>
            )}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-gold">✦</span>
            Essências de luxo
            <span className="text-gold">✦</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
