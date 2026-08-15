export const site = {
  name: "Perfumaria Suanne",
  tagline: "Essências que eternizam momentos",
  url: "https://perfumariasuanne.com.br",
  whatsapp: "5521982755539",
  phone: "(21) 98275-5539",
  email: "suanne.chagas4@gmail.com",
  instagram: "https://instagram.com/suannechagas",
  address: "Avenida João Ribeiro, 444 — Loja D, Pilares, Rio de Janeiro/RJ",
  cep: "20750095",
  giftAbove: 300,
  shippingFee: 19.9,
  freeShippingAbove: 300,
};

export type ShippingInfo = {
  free: boolean;
  fee: number;
  remaining: number;
};

export function shippingFor(subtotal: number): ShippingInfo {
  const free = subtotal >= site.freeShippingAbove;
  return {
    free,
    fee: free ? 0 : site.shippingFee,
    remaining: Math.max(0, site.freeShippingAbove - subtotal),
  };
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function pixPrice(value: number): number {
  return Math.round(value * 0.95 * 100) / 100;
}

export function whatsappLink(message: string): string {
  const base = "https://wa.me/";
  const clean = site.whatsapp.replace(/\D/g, "");
  return `${base}${clean}?text=${encodeURIComponent(message)}`;
}
