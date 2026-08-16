import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Analytics from "@/components/Analytics";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Perfumes Importados de Luxo`,
    template: `%s — ${site.name}`,
  },
  description:
    "Perfumaria Suanne: curadoria de perfumes importados e autorais de luxo. Envio para todo o Brasil com rastreio e presente exclusivo. Navegue com elegância e sofisticação.",
  metadataBase: new URL(site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — Perfumes Importados de Luxo`,
    description:
      "Essências que eternizam momentos. Perfumes importados e autorais com curadoria exclusiva.",
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${jost.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: site.name,
              url: site.url,
              email: site.email,
              telephone: site.phone,
              description:
                "Perfumaria Suanne: curadoria de perfumes importados e autorais de luxo. Envio para todo o Brasil com rastreio.",
              address: {
                "@type": "PostalAddress",
                streetAddress: site.address,
                postalCode: site.cep,
                addressCountry: "BR",
              },
              areaServed: "BR",
            }),
          }}
        />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
