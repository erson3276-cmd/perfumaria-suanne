"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  qty: number;
};

export type CartLine = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "perfumaria-suanne-cart";

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) => typeof i.slug === "string" && typeof i.qty === "number"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Ler o carrinho salvo do navegador logo após a montagem (evita
    // diferença entre o HTML servido e o conteúdo hidratado).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage indisponível — segue sem persistência
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback((slug: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, qty: Math.min(i.qty + 1, 10) } : i
        );
      }
      return [...prev, { slug, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 10) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items
      .map((item) => {
        const product = getProductBySlug(item.slug);
        return product ? { product, qty: item.qty } : null;
      })
      .filter((l): l is CartLine => l !== null);

    const count = lines.reduce((acc, l) => acc + l.qty, 0);
    const subtotal = lines.reduce(
      (acc, l) => acc + l.product.price * l.qty,
      0
    );

    return {
      items,
      lines,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      add,
      remove,
      setQty,
      clear,
    };
  }, [items, isOpen, openCart, closeCart, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}
