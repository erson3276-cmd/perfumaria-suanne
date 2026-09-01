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
    slug: "asad",
    name: "Asad",
    brand: "Lattafa",
    category: "Masculino",
    price: 269.9,
    originalPrice: 299.9,
    rating: 4.8,
    reviews: 231,
    size: "100ml",
    image: "/perfumes/asad.jpg",
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
    slug: "yara-rosa",
    name: "Yara Rosa",
    brand: "Lattafa",
    category: "Feminino",
    price: 239.9,
    rating: 4.7,
    reviews: 124,
    size: "100ml",
    image: "/perfumes/yara-rosa.jpg",
    badge: "Novo",
    featured: false,
    inStock: true,
    description:
      "A delicadeza do Yara em versão rosé: orquídea, heliotrópio e tangerina abrem para um coração gourmand de frutas tropicais. Fundo cremoso de baunilha, almíscar e sândalo. Doce, feminina e viciante.",
    notes: {
      top: ["Orquídea", "Heliotrópio", "Tangerina"],
      heart: ["Acorde Gourmand", "Frutas Tropicais"],
      base: ["Baunilha", "Almíscar", "Sândalo"],
    },
  },
  {
    slug: "sabah-al-ward",
    name: "Sabah Al Ward",
    brand: "Al Wataniah",
    category: "Feminino",
    price: 229.9,
    rating: 4.8,
    reviews: 76,
    size: "100ml",
    image: "/perfumes/sabah-al-ward.jpg",
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
    slug: "no-2-men",
    name: "No. 2 Men",
    brand: "Maison Alhambra",
    category: "Masculino",
    price: 199.9,
    rating: 4.6,
    reviews: 48,
    size: "100ml",
    image: "/perfumes/no-2-men.jpg",
    featured: false,
    inStock: true,
    description:
      "Aromático moderno e limpo (inspirado no DNA do 212 Men): bergamota e lavanda abrem para gengibre e cardamomo. Fundo amadeirado de vetiver, incenso, sândalo, guaiac e ládano. Elegante, fresco e versátil.",
    notes: {
      top: ["Bergamota", "Lavanda"],
      heart: ["Gengibre", "Cardamomo"],
      base: ["Vetiver", "Incenso", "Almíscar", "Sândalo", "Ládano", "Madeira Guaiac"],
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
    image: "/perfumes/durrat-al-aroos.jpg",
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
    slug: "afeef",
    name: "Afeef EDP",
    brand: "Lattafa",
    category: "Unissex",
    price: 579.9,
    rating: 4.8,
    reviews: 52,
    size: "100ml",
    image: "/perfumes/afeef.jpg",
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
    slug: "intrude",
    name: "L'Intrude",
    brand: "Maison Alhambra",
    category: "Feminino",
    price: 219.9,
    rating: 4.6,
    reviews: 37,
    size: "100ml",
    image: "/perfumes/intrude.jpg",
    featured: false,
    inStock: true,
    description:
      "Oriental especiado sofisticado da Maison Alhambra: citrinos e framboesa com pimenta rosa abrem para jasmim, rosa e íris. Fundo amadeirado e balsâmico de âmbar, patchouli e almíscar. Envolvente, dramática e marcante.",
    notes: {
      top: ["Citrinos", "Framboesa", "Pimenta Rosa"],
      heart: ["Jasmim", "Rosa", "Íris"],
      base: ["Âmbar", "Patchouli", "Almíscar"],
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
    image: "/perfumes/khamrah.jpg",
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
    slug: "odyssey-spectra",
    name: "Odyssey Spectra",
    brand: "Armaf",
    category: "Unissex",
    price: 289.9,
    rating: 4.7,
    reviews: 83,
    size: "100ml",
    image: "/perfumes/odyssey-spectra.jpg",
    featured: false,
    inStock: true,
    description:
      "O fougère oriental intenso da Armaf (inspirado no DNA do Ultra Male): maçã, canela e bergamota abrem para lavanda, flor de laranjeira e muguet. Fundo doce-amadeirado de vani, tonka, âmbar, patchouli e tabaco. Potente, doce e irresistível.",
    notes: {
      top: ["Canela", "Maçã", "Bergamota"],
      heart: ["Lavanda", "Flor de Laranjeira", "Muguet"],
      base: ["Vani", "Fava Tonka", "Âmbar", "Patchouli", "Tabaco"],
    },
  },
  {
    slug: "yara-moi",
    name: "Yara Moi",
    brand: "Lattafa",
    category: "Feminino",
    price: 239.9,
    rating: 4.7,
    reviews: 156,
    size: "100ml",
    image: "/perfumes/yara-moi.jpg",
    featured: false,
    inStock: true,
    description:
      "A irmã branca e elegante do Yara: jasmim e pêssego abrem para um coração aconchegante de caramelo e âmbar. Fundo de patchouli e sândalo traz profundidade. Aveludada, feminina e sofisticada.",
    notes: {
      top: ["Jasmim", "Pêssego"],
      heart: ["Caramelo", "Âmbar"],
      base: ["Patchouli", "Sândalo"],
    },
  },
  {
    slug: "club-de-nuit-intense-man",
    name: "Club de Nuit Intense Man",
    brand: "Armaf",
    category: "Masculino",
    price: 289.9,
    originalPrice: 319.9,
    rating: 4.8,
    reviews: 412,
    size: "105ml",
    image: "/perfumes/club-de-nuit-intense-man.jpg",
    badge: "Favorito",
    featured: false,
    inStock: true,
    description:
      "O fenômeno da Armaf (inspirado no DNA do Aventus): limão, abacaxi e groselha preta abrem para bétula, jasmim e rosa. Fundo de âmbar cinzento, patchouli, baunilha e almíscar. Esfumaçado, imponente e de presença absurda.",
    notes: {
      top: ["Limão", "Abacaxi", "Bergamota", "Groselha Preta", "Maçã"],
      heart: ["Bétula", "Jasmim", "Rosa"],
      base: ["Almíscar", "Âmbar Cinzento", "Patchouli", "Baunilha"],
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
    slug: "fakhar-black",
    name: "Fakhar Black",
    brand: "Lattafa",
    category: "Masculino",
    price: 289.9,
    originalPrice: 319.9,
    rating: 4.7,
    reviews: 156,
    size: "100ml",
    image: "/perfumes/fakhar-black.jpg",
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