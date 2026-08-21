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
  olistId?: number;
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
    olistId: 343312153,
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
    olistId: 343312097,
    description:
      "Delícia gourmand frutado-floral: tangerina verde e cassis abrem para morango doce (strawberry fizz) e gardenia. Fundo cremoso de sândalo, baunilha, almíscar e âmbar. Doce, jovem e contagiante.",
    notes: {
      top: ["Tangerina Verde", "Cassis"],
      heart: ["Morango Doce", "Gardenia"],
      base: ["Sândalo", "Baunilha", "Almíscar", "Âmbar"],
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
    olistId: 343315844,
    description:
      "A 'pérola da noiva': almíscar branco e cipriol abrem para baunilha, cardamomo e açafrão. Fundo de guaiac e cumaron. Oriental sofisticado que evoca a elegância da perfumaria árabe.",
    notes: {
      top: ["Almíscar Branco", "Cipriol"],
      heart: ["Baunilha", "Cardamomo", "Açafrão"],
      base: ["Guaiac", "Cumaron"],
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
    olistId: 343312061,
    description:
      "O gourmand oriental que virou febre mundial: bergamota, canela e noz-moscada abrem para tâmaras, lírio do vale, pralinê e tuberosa. Fundo envolvente de tonka, benjoim, mirra, akigalawood, baunilha e âmbar. Quente, doce e inesquecível.",
    notes: {
      top: ["Bergamota", "Canela", "Noz-Moscada"],
      heart: ["Tâmara", "Lírio do Vale", "Pralinê", "Tuberosa"],
      base: ["Fava Tonka", "Benjoim", "Mirra", "Akigalawood", "Baunilha", "Âmbar"],
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
    olistId: 343312125,
    description:
      "Um contraste sedutor entre frescor e calor: pêra, lavanda, hortelã, bergamota e limão abrem para canela, sálvia e cominho. Fundo cremoso de baunilha preta âmbar, cedro e patchouli. Elegante e versátil.",
    notes: {
      top: ["Pêra", "Lavanda", "Hortelã", "Bergamota", "Limão"],
      heart: ["Canela", "Sálvia", "Cominho"],
      base: ["Baunilha Preta", "Âmbar", "Cedro", "Patchouli"],
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
    olistId: 343312082,
    description:
      "O elixir oriental marcante da Lattafa: pimenta preta, abacaxi e tabaco abrem para patchouli, café e íris. Fundo de baunilha, âmbar, madeira seca, benjoim e labdano. Intenso, sofisticado e persistente.",
    notes: {
      top: ["Pimenta Preta", "Abacaxi", "Tabaco"],
      heart: ["Patchouli", "Café", "Íris"],
      base: ["Baunilha", "Âmbar", "Madeira Seca", "Benjoim", "Labdano"],
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
    olistId: 343315851,
    description:
      "Oriental moderno e versátil (inspirado no YSL Y EDP): maçã, bergamota e gengibre abrem para lavanda, sálvia, zimbro e gerânio. Fundo de tonka, cedro, âmbar e vetiver. O equilíbrio perfeito entre casual e elegante.",
    notes: {
      top: ["Maçã", "Bergamota", "Gengibre"],
      heart: ["Lavanda", "Sálvia", "Zimbro", "Gerânio"],
      base: ["Fava Tonka", "Cedro", "Âmbar", "Vetiver"],
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
    olistId: 343315854,
    description:
      "A interpretação mais acessível do DNA ambergris (inspirado no Baccarat Rouge 540): pêra nashi, kumquat e bergamota abrem para caramelo e gerânio. Fundo de âmbar cinzento (ambergris), almíscar e musgo de carvalho. Um segredo entre os perfumistas.",
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
    olistId: 343315741,
    description:
      "O lançamento mais desejado da Lattafa (2024): bergamota, pimenta rosa e pêssego abrem para jasmim, flor de laranjeira e tuberosa. Fundo cremoso de pralinê, sândalo, âmbar e patchouli. Um floral frutado sofisticado e viciante.",
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
