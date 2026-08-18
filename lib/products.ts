export type Category = "Feminino" | "Masculino" | "Unissex";

export const categories: Category[] = [
  "Feminino",
  "Masculino",
  "Unissex",
];

export type Note = {
  top: string[];
  heart: string[];
  base: string[];
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  size: string;
  image: string;
  badge?: string;
  featured?: boolean;
  inStock: boolean;
  description: string;
  notes: Note;
};

export const products: Product[] = [
  {
    slug: "sabah-al-ward",
    name: "Sabah Al Ward",
    brand: "Al Wataniah",
    category: "Feminino",
    price: 229.9,
    rating: 4.8,
    reviews: 76,
    size: "100ml",
    image: "/perfumes/sabah-al-ward.png",
    badge: "Novo",
    featured: false,
    inStock: true,
    description:
      "O \"amanhecer das rosas\": floral oriental que une cacau, flor de laranjeira e jasmim sambac sobre baunilha e patchouli. Doce, elegante e com presença marcante.",
    notes: {
      top: ["Pimenta Rosa", "Tangerina"],
      heart: ["Cacau", "Flor de Laranjeira", "Jasmim Sambac"],
      base: ["Baunilha", "Fava Tonka", "Patchouli"],
    },
  },
  {
    slug: "yara-candy",
    name: "Yara Candy",
    brand: "Lattafa",
    category: "Feminino",
    price: 229.9,
    rating: 4.7,
    reviews: 201,
    size: "100ml",
    image: "/perfumes/yara-candy.jpg",
    featured: false,
    inStock: true,
    description:
      "Delícia açucarada de frutas vermelhas com jasmim e baunilha. Doce, jovem e contagiante.",
    notes: {
      top: ["Frutas Vermelhas"],
      heart: ["Jasmim"],
      base: ["Baunilha", "Almíscar"],
    },
  },
  {
    slug: "durrat-al-aroos",
    name: "Durrat Al Aroos",
    brand: "Al Wataniah",
    category: "Feminino",
    price: 219.9,
    rating: 4.7,
    reviews: 64,
    size: "85ml",
    image: "/perfumes/Durrat-Al-Aroos (2).jpg",
    featured: false,
    inStock: true,
    description:
      "A \"pérola da noiva\": oriental sofisticado com almíscar branco, baunilha e açafrão sobre madeiras quentes. A elegância da perfumaria árabe.",
    notes: {
      top: ["Almíscar Branco", "Cipriol"],
      heart: ["Baunilha", "Cardamomo", "Açafrão"],
      base: ["Fava Tonka", "Madeira Guaiac"],
    },
  },
  {
    slug: "khamrah",
    name: "Khamrah",
    brand: "Lattafa",
    category: "Unissex",
    price: 229.9,
    originalPrice: 259.9,
    rating: 4.9,
    reviews: 486,
    size: "100ml",
    image: "/perfumes/khamrah-novo.jpg",
    badge: "Best Seller",
    featured: true,
    inStock: true,
    description:
      "O gourmand dourado que virou febre: tâmaras, canela e pralinê sobre baunilha e âmbar. Quente, doce e inesquecível.",
    notes: {
      top: ["Canela", "Noz-Moscada"],
      heart: ["Tâmara", "Pralinê"],
      base: ["Baunilha", "Âmbar", "Fava Tonka"],
    },
  },
  {
    slug: "attar-al-wesal",
    name: "Attar Al Wesal",
    brand: "Al Wataniah",
    category: "Unissex",
    price: 209.9,
    rating: 4.7,
    reviews: 89,
    size: "100ml",
    image: "/perfumes/attar-al-wesal-novo.jpg",
    featured: false,
    inStock: true,
    description:
      "Um contraste sedutor entre frescor e calor: pêra e hortelã abrem para canela e sálvia, com fundo cremoso de baunilha preta e âmbar.",
    notes: {
      top: ["Pêra", "Lavanda", "Hortelã", "Bergamota"],
      heart: ["Canela", "Sálvia", "Cominho"],
      base: ["Baunilha Preta", "Âmbar", "Patchouli", "Cedro"],
    },
  },
  {
    slug: "asad",
    name: "Asad",
    brand: "Lattafa",
    category: "Masculino",
    price: 269.9,
    originalPrice: 299.9,
    rating: 4.8,
    reviews: 231,
    size: "100ml",
    image: "/perfumes/asad-novo.jpg",
    badge: "Favorito",
    featured: true,
    inStock: true,
    description:
      "O elixir marcante inspirado nas notas mais desejadas do momento. Lavanda, pimenta e baunilha em um abraço esfumaçado.",
    notes: {
      top: ["Bergamota", "Pimenta"],
      heart: ["Lavanda", "Canela"],
      base: ["Baunilha", "Âmbar", "Pralinê"],
    },
  },
  {
    slug: "fakhar-black",
    name: "Fakhar Black",
    brand: "Lattafa",
    category: "Masculino",
    price: 289.9,
    rating: 4.7,
    reviews: 156,
    size: "100ml",
    image: "/perfumes/Fakhar Black.jpg",
    featured: false,
    inStock: true,
    description:
      "Um fougère moderno e versátil: maçã, lavanda e gengibre com fundo amadeirado fresco. O equilíbrio perfeito entre casual e elegante.",
    notes: {
      top: ["Maçã", "Bergamota"],
      heart: ["Lavanda", "Gengibre"],
      base: ["Cedro", "Âmbar", "Madeiras"],
    },
  },
  {
    slug: "ana-abiyedh-rouge",
    name: "Ana Abiyedh Rouge",
    brand: "Lattafa",
    category: "Unissex",
    price: 189.9,
    rating: 4.7,
    reviews: 158,
    size: "60ml",
    image: "/perfumes/ana-abiyedh-rouge.jpg",
    badge: "Novo",
    featured: false,
    inStock: true,
    description:
      "A interpretação mais acessível do DNA âmbar-forte: frutado, doce e almiscarado, com caramelo e âmbar cinzento. Um segredo entre os perfumistas.",
    notes: {
      top: ["Pêra Nashi", "Kumquat", "Bergamota"],
      heart: ["Caramelo", "Gerânio"],
      base: ["Âmbar Cinzento", "Almíscar", "Musgo de Carvalho"],
    },
  },
  {
    slug: "afeef",
    name: "Afeef EDP",
    brand: "Lattafa",
    category: "Unissex",
    price: 579.9,
    rating: 4.8,
    reviews: 52,
    size: "100ml",
    image: "/perfumes/Afeef.jpg",
    badge: "Novo",
    featured: false,
    inStock: true,
    description:
      "O lançamento mais desejado da Lattafa: pêssego e tuberosa sobre pralinê e sândalo. Um floral frutado cremoso, sofisticado e viciante.",
    notes: {
      top: ["Pêssego", "Pimenta Rosa", "Bergamota"],
      heart: ["Tuberosa", "Jasmim", "Flor de Laranjeira"],
      base: ["Pralinê", "Sândalo", "Âmbar", "Patchouli"],
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 8);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category
  );
  const others = products.filter(
    (p) => p.slug !== product.slug && p.category !== product.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
