import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductsClient from "../../ProductsClient";

type CategoriaParams = { params: Promise<{ categoria: string }> };

const categoryMeta: Record<
  string,
  { title: string; description: string }
> = {
  feminino: {
    title: "Perfumes Femininos Importados e Árabes",
    description:
      "Perfumes femininos importados e árabes de luxo: doces, florais, frutais e orientais. 100% originais com envio para todo o Brasil.",
  },
  masculino: {
    title: "Perfumes Masculinos Importados e Árabes",
    description:
      "Perfumes masculinos importados e árabes de luxo: amadeirados, aromáticos e marcantes. 100% originais com envio para todo o Brasil.",
  },
  unissex: {
    title: "Perfumes Unissex Importados e Árabes",
    description:
      "Perfumes unissex importados e árabes de luxo: âmbar, oud, patchouli e fragrâncias versáteis. 100% originais com envio para todo o Brasil.",
  },
  presentes: {
    title: "Presentes de Perfume para Presentear",
    description:
      "Caixas e conjuntos de perfume ideais para presentear: essências de luxo que eternizam momentos. Envio para todo o Brasil.",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: CategoriaParams): Promise<Metadata> {
  const { categoria } = await params;
  const meta = categoryMeta[categoria];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/produtos/categoria/${categoria}` },
  };
}

export default async function CategoriaPage({ params }: CategoriaParams) {
  const { categoria } = await params;
  if (!categoryMeta[categoria]) notFound();
  return (
    <Suspense
      fallback={
        <div className="py-40 text-center font-serif text-2xl text-ink">
          Carregando perfumes...
        </div>
      }
    >
      <ProductsClient categoria={categoria} />
    </Suspense>
  );
}
