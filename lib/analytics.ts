"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type TrackedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
};

export type AnalyticsItem = TrackedProduct & {
  qty: number;
};

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID ?? "";
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";

export const hasPixel = () => pixelId.length > 0;
export const hasGa4 = () => ga4Id.length > 0;
export const hasGoogleAds = () => googleAdsId.length > 0;

export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  if (hasPixel() && !window.fbq) {
    window.fbq = function (...args: unknown[]) {
      const q = (window.fbq as unknown as { q?: unknown[] }).q ?? [];
      q.push(args);
      (window.fbq as unknown as { q: unknown[] }).q = q;
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  if (hasGa4() && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", ga4Id);
    if (hasGoogleAds()) {
      window.gtag("config", googleAdsId);
    }
  }
}

function fbqEvent(event: string, params: Record<string, unknown>): void {
  if (hasPixel()) window.fbq?.("track", event, params);
}

function gtagEvent(
  event: string,
  params: Record<string, unknown>
): void {
  if (hasGa4()) window.gtag?.("event", event, params);
}

export function trackViewContent(product: TrackedProduct): void {
  fbqEvent("ViewContent", {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.slug],
    content_type: "product",
    value: product.price,
    currency: "BRL",
  });
  gtagEvent("view_item", {
    currency: "BRL",
    value: product.price,
    items: [toGtagItem({ ...product, qty: 1 })],
  });
}

export function trackAddToCart(product: TrackedProduct): void {
  fbqEvent("AddToCart", {
    content_ids: [product.slug],
    content_name: product.name,
    content_category: product.category,
    content_type: "product",
    value: product.price,
    currency: "BRL",
  });
  gtagEvent("add_to_cart", {
    currency: "BRL",
    value: product.price,
    items: [toGtagItem({ ...product, qty: 1 })],
  });
}

export function trackBeginCheckout(
  items: AnalyticsItem[],
  subtotal: number
): void {
  fbqEvent("InitiateCheckout", {
    content_ids: items.map((i) => i.slug),
    num_items: items.reduce((acc, i) => acc + i.qty, 0),
    value: subtotal,
    currency: "BRL",
  });
  gtagEvent("begin_checkout", {
    currency: "BRL",
    value: subtotal,
    items: items.map(toGtagItem),
  });
}

export function trackPurchase(
  items: AnalyticsItem[],
  subtotal: number,
  total: number,
  transactionId?: string
): void {
  fbqEvent("Purchase", {
    content_ids: items.map((i) => i.slug),
    content_type: "product",
    num_items: items.reduce((acc, i) => acc + i.qty, 0),
    value: total,
    currency: "BRL",
    transaction_id: transactionId,
  });
  gtagEvent("purchase", {
    currency: "BRL",
    value: total,
    transaction_id: transactionId,
    items: items.map(toGtagItem),
  });
  if (hasGoogleAds() && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${transactionId || "pending"}`,
      value: total,
      currency: "BRL",
      transaction_id: transactionId,
    });
  }
}

function toGtagItem(item: AnalyticsItem) {
  return {
    item_id: item.slug,
    item_name: item.name,
    item_brand: item.brand,
    item_category: item.category,
    price: item.price,
    quantity: item.qty,
  };
}
