import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Perfumes Importados e Árabes — Coleção Completa",
  description:
    "Compre perfumes importados, árabes e de nicho: Lattafa, Armaf, Maison Alhambra, Orientica e mais. 100% originais, com frete grátis acima de R$ 300 e envio para todo o Brasil.",
  alternates: { canonical: "/produtos" },
};

export default function ProdutosPage() {
  return (
    <Suspense
      fallback={
        <div className="py-40 text-center font-serif text-2xl text-ivory">
          Carregando perfumes...
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
