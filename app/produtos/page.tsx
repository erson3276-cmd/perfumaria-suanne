import { Suspense } from "react";
import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Perfumes Importados de Luxo",
  description:
    "Explore a coleção de perfumes importados e autorais da Perfumaria Suanne. Filtre por categoria, busque por nota ou fragrância e escolha a sua essência.",
};

export default function ProdutosPage() {
  return (
    <Suspense
      fallback={
        <div className="py-40 text-center font-serif text-2xl text-ink">
          Carregando perfumes...
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
