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
      <head>
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://sdk.mercadopago.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '2852416835144977');fbq('track', 'PageView');`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2852416835144977&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
              ...(site.cnpj ? {
                identifier: { "@type": "PropertyValue", name: "CNPJ", value: site.cnpj },
              } : {}),
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
