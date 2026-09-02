import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { site } from "@/lib/site";

const categoryRoutes = [
  "feminino",
  "masculino",
  "unissex",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/produtos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...(categoryRoutes.map((categoria): MetadataRoute.Sitemap[number] => ({
      url: `${site.url}/produtos/categoria/${categoria}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))),
    {
      url: `${site.url}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${site.url}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${site.url}/produtos/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
