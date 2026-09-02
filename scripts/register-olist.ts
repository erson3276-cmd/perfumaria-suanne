const TOKEN = "48caa634ad811fc631f89f906aa5a2973a2ca5ad68420aa2114ec238a0f0e2a4";
const API_BASE = "https://api.tiny.com.br/api2";
const SITE_URL = "https://perfumaria-suanne.com.br/perfumes";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type ProductData = {
  nome: string;
  codigo: string;
  preco: string;
  estoque: string;
  estoque_minimo: string;
  peso_liquido: string;
  peso_bruto: string;
  tipo_embalagem: string;
  altura_embalagem: string;
  largura_embalagem: string;
  comprimento_embalagem: string;
  marca: string;
  ncm: string;
  cest: string;
  gtin: string;
  classe_produto: string;
  origem: string;
  descricao: string;
  seo: { title: string; keywords: string; description: string };
  imagens: string[];
  slug: string;
};

const products: ProductData[] = [
  {
    slug: "yara-rosa",
    nome: "Yara Rosa - Perfume Feminino Lattafa 100ml",
    codigo: "LAT-YARO-100ML",
    preco: "239.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.450",
    tipo_embalagem: "2",
    altura_embalagem: "15.09",
    largura_embalagem: "9.04",
    comprimento_embalagem: "9.04",
    marca: "Lattafa",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6291108730515",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>Yara Rosa by Lattafa - Floral Frutado Gourmand Feminino<br><br>A delicadeza do iconico Yara em versao rose: orquidea, heliotropio e tangerina abrem para um coracao doce de acorde gourmand e frutas tropicais. Fundo cremoso de baunilha, almiscar e sandalo. Doce, feminina e viciante.<br><br>NOTAS DE TOPO: Orquidea, Heliotropio, Tangerina<br>NOTAS DE CORACAO: Acorde Gourmand, Frutas Tropicais<br>NOTAS DE FUNDO: Baunilha, Almiscar, Sandalo<br><br>EDP 100ml | Feminino | Lattafa Perfumes (EAU)</p>",
    seo: {
      title: "Yara Rosa Lattafa 100ml | Perfume Feminino Floral Frutado | Perfumaria Suanne",
      keywords: "yara rosa,lattafa,perfume feminino,floral frutado,gourmand,edp,100ml",
      description: "Compre Yara Rosa by Lattafa 100ml EDP - floral frutado doce com orquidea, heliotropio, tangerina e baunilha. Frete gratis.",
    },
    imagens: [`${SITE_URL}/yara-rosa.jpg`],
  },
  {
    slug: "no-2-men",
    nome: "No. 2 Men - Perfume Masculino Maison Alhambra 100ml",
    codigo: "MAH-NO2-100ML",
    preco: "199.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.480",
    tipo_embalagem: "2",
    altura_embalagem: "10.00",
    largura_embalagem: "5.00",
    comprimento_embalagem: "5.00",
    marca: "Maison Alhambra",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6291108730249",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>No. 2 Men by Maison Alhambra - Aromatico Masculino (2022)<br><br>Aromatico moderno e limpo inspirado no DNA do 212 Men: bergamota e lavanda abrem para gengibre e cardamomo. Fundo amadeirado de vetiver, incenso, almiscar, sandalo, ladano e madeira guaiac. Elegante, fresco e versatil.<br><br>NOTAS DE TOPO: Bergamota, Lavanda<br>NOTAS DE CORACAO: Gengibre, Cardamomo<br>NOTAS DE FUNDO: Vetiver, Incenso, Almiscar, Sandalo, Ladano, Madeira Guaiac<br><br>EDP 100ml | Masculino | Maison Alhambra by Lattafa (EAU)</p>",
    seo: {
      title: "No. 2 Men Maison Alhambra 100ml | Perfume Masculino Aromatico | Perfumaria Suanne",
      keywords: "no. 2 men,maison alhambra,perfume masculino,aromatico,212 men,edp,100ml",
      description: "Compre No. 2 Men by Maison Alhambra 100ml EDP - aromatico fresco e versatil com bergamota, lavanda, cardamomo e vetiver. Frete gratis.",
    },
    imagens: [`${SITE_URL}/no-2-men.jpg`],
  },
  {
    slug: "intrude",
    nome: "L'Intrude - Perfume Feminino Maison Alhambra 100ml",
    codigo: "MAH-INTR-100ML",
    preco: "219.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.450",
    tipo_embalagem: "2",
    altura_embalagem: "16.50",
    largura_embalagem: "7.60",
    comprimento_embalagem: "5.10",
    marca: "Maison Alhambra",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6291108730171",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>L'Intrude by Maison Alhambra - Floral Feminino (2022)<br><br>O floral envolvente inspirado no DNA do L'Interdit: pera e bergamota abrem para tuberosa, flor de laranjeira e jasmim sambac. Fundo quente de ambroxan, patchouli, baunilha e vetiver. Doce, elegante e sofisticado.<br><br>NOTAS DE TOPO: Pera, Bergamota<br>NOTAS DE CORACAO: Tuberosa, Flor de Laranjeira, Jasmim Sambac<br>NOTAS DE FUNDO: Ambroxan, Patchouli, Baunilha, Vetiver<br><br>EDP 100ml | Feminino | Maison Alhambra by Lattafa (EAU)</p>",
    seo: {
      title: "L'Intrude Maison Alhambra 100ml | Perfume Feminino Floral Branco | Perfumaria Suanne",
      keywords: "l'intrude,maison alhambra,perfume feminino,floral,tuberosa,l'interdit,edp,100ml",
      description: "Compre L'Intrude by Maison Alhambra 100ml EDP - floral branco com pera, tuberosa, flor de laranjeira e baunilha. Frete gratis.",
    },
    imagens: [`${SITE_URL}/intrude.jpg`],
  },
  {
    slug: "odyssey-spectra",
    nome: "Odyssey Spectra - Perfume Unissex Armaf 100ml",
    codigo: "ARM-ODY-100ML",
    preco: "289.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.450",
    tipo_embalagem: "2",
    altura_embalagem: "11.43",
    largura_embalagem: "8.26",
    comprimento_embalagem: "7.62",
    marca: "Armaf",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6294015188653",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>Odyssey Spectra by Armaf - Fougere Oriental (2024)<br><br>O fougere oriental intenso inspirado no DNA do Ultra Male: canela, maca e bergamota abrem para lavanda, flor de laranjeira e lirio do vale. Fundo doce-amadeirado de baunilha, fava tonka, ambar, patchouli e tabaco. Potente, doce e irresistivel.<br><br>NOTAS DE TOPO: Canela, Maca, Bergamota<br>NOTAS DE CORACAO: Lavanda, Flor de Laranjeira, Lirio do Vale<br>NOTAS DE FUNDO: Baunilha, Fava Tonka, Ambar, Patchouli, Tabaco<br><br>EDP 100ml | Unissex | Armaf (EAU)</p>",
    seo: {
      title: "Odyssey Spectra Armaf 100ml | Perfume Unissex Fougere Oriental | Perfumaria Suanne",
      keywords: "odyssey spectra,armaf,perfume unissex,fougere oriental,ultra male,edp,100ml",
      description: "Compre Odyssey Spectra by Armaf 100ml EDP - fougere oriental doce com canela, maca, lavanda e baunilha. Frete gratis.",
    },
    imagens: [`${SITE_URL}/odyssey-spectra.jpg`],
  },
  {
    slug: "yara-moi",
    nome: "Yara Moi - Perfume Feminino Lattafa 100ml",
    codigo: "LAT-YARM-100ML",
    preco: "239.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.450",
    tipo_embalagem: "2",
    altura_embalagem: "15.00",
    largura_embalagem: "9.40",
    comprimento_embalagem: "9.10",
    marca: "Lattafa",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6290360591421",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>Yara Moi by Lattafa - Amber Floral Feminino (2022)<br><br>A irma branca e elegante do Yara: jasmim e pessego abrem para um coracao aconchegante de caramelo e ambar. Fundo de patchouli e sandalo traz profundidade. Aveludada, feminina e sofisticada.<br><br>NOTAS DE TOPO: Jasmim, Pessego<br>NOTAS DE CORACAO: Caramelo, Ambar<br>NOTAS DE FUNDO: Patchouli, Sandalo<br><br>EDP 100ml | Feminino | Lattafa Perfumes (EAU)</p>",
    seo: {
      title: "Yara Moi Lattafa 100ml | Perfume Feminino Amber Floral | Perfumaria Suanne",
      keywords: "yara moi,yara white,lattafa,perfume feminino,amber,caramelo,edp,100ml",
      description: "Compre Yara Moi by Lattafa 100ml EDP - amber floral com jasmim, pessego, caramelo e patchouli. Frete gratis.",
    },
    imagens: [`${SITE_URL}/yara-moi.jpg`],
  },
  {
    slug: "club-de-nuit-intense-man",
    nome: "Club de Nuit Intense Man - Perfume Masculino Armaf 105ml",
    codigo: "ARM-CDN-105ML",
    preco: "289.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.350",
    peso_bruto: "0.500",
    tipo_embalagem: "2",
    altura_embalagem: "14.40",
    largura_embalagem: "9.19",
    comprimento_embalagem: "6.30",
    marca: "Armaf",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6085010044712",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>Club de Nuit Intense Man by Armaf - Woody Spicy Masculino (2015)<br><br>O fenomeno mundial inspirado no DNA do Aventus: limao, abacaxi, bergamota, groselha preta e maca abrem para betula, jasmim e rosa. Fundo esfumacado de almiscar, ambar cinzento, patchouli e baunilha. Imponente e de presenca absurda.<br><br>NOTAS DE TOPO: Limao, Abacaxi, Bergamota, Groselha Preta, Maca<br>NOTAS DE CORACAO: Betula, Jasmim, Rosa<br>NOTAS DE FUNDO: Almiscar, Ambar Cinzento, Patchouli, Baunilha<br><br>EDP 105ml | Masculino | Armaf (EAU)</p>",
    seo: {
      title: "Club de Nuit Intense Man Armaf 105ml | Perfume Masculino Woody Spicy | Perfumaria Suanne",
      keywords: "club de nuit intense man,armaf,perfume masculino,woody spicy,aventus,edp,105ml",
      description: "Compre Club de Nuit Intense Man by Armaf 105ml EDP - woody spicy com abacaxi, betula, ambar e almiscar. Frete gratis.",
    },
    imagens: [`${SITE_URL}/club-de-nuit-intense-man.jpg`],
  },
  {
    slug: "yeah-man",
    nome: "Yeah! Man - Perfume Masculino Maison Alhambra 100ml",
    codigo: "MAH-YEA-100ML",
    preco: "199.90",
    estoque: "5",
    estoque_minimo: "2",
    peso_liquido: "0.300",
    peso_bruto: "0.450",
    tipo_embalagem: "2",
    altura_embalagem: "16.50",
    largura_embalagem: "7.60",
    comprimento_embalagem: "5.10",
    marca: "Maison Alhambra",
    ncm: "3303.00.10",
    cest: "20.058.00",
    gtin: "6291108730324",
    classe_produto: "S",
    origem: "3",
    descricao: "<p>Yeah! Man by Maison Alhambra - Aromatico Frutado Masculino (2023)<br><br>A versao da Maison Alhambra inspirada no DNA do YSL Y EDP: maca, gengibre e bergamota abrem para salvias, zimbro e geranio. Fundo envolvente de amberwood, fava tonka, cedro, vetiver e olibano. Moderno, vibrante e irresistivel.<br><br>NOTAS DE TOPO: Maca, Gengibre, Bergamota<br>NOTAS DE CORACAO: Salvia, Zimbro, Geranio<br>NOTAS DE FUNDO: Amberwood, Fava Tonka, Cedro, Vetiver, Olibano<br><br>EDP 100ml | Masculino | Maison Alhambra by Lattafa (EAU)</p>",
    seo: {
      title: "Yeah! Man Maison Alhambra 100ml | Perfume Masculino Aromatico | Perfumaria Suanne",
      keywords: "yeah man,maison alhambra,perfume masculino,aromatico,ysl y,edp,100ml",
      description: "Compre Yeah! Man by Maison Alhambra 100ml EDP - aromatico frutado com maca, gengibre, salvias e fava tonka. Frete gratis.",
    },
    imagens: [`${SITE_URL}/yeah-man.jpg`],
  },
];

async function searchProduct(code: string): Promise<{ id: number; nome: string } | null> {
  const res = await fetch(`${API_BASE}/produtos.pesquisa.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `token=${TOKEN}&pesquisa=${encodeURIComponent(code)}&formato=JSON`,
  });
  const data = await res.json();

  if (data.retorno?.status === "OK" && data.retorno?.produtos) {
    for (const p of data.retorno.produtos) {
      if (p.produto?.codigo === code) {
        return { id: p.produto.id, nome: p.produto.nome };
      }
    }
  }
  return null;
}

function buildProdutoBase(p: ProductData, seq: number, id?: number) {
  return {
    sequencia: seq,
    ...(id ? { id } : {}),
    nome: p.nome,
    codigo: p.codigo,
    preco: p.preco,
    tipo: "P",
    situacao: "A",
    unidade: "UN",
    marca: p.marca,
    categoria: "Perfumes",
    tipo_embalagem: p.tipo_embalagem,
    altura_embalagem: p.altura_embalagem,
    largura_embalagem: p.largura_embalagem,
    comprimento_embalagem: p.comprimento_embalagem,
    ncm: p.ncm,
    cest: p.cest,
    gtin: p.gtin,
    classe_produto: p.classe_produto,
    origem: p.origem,
    estoque: p.estoque,
    estoque_minimo: p.estoque_minimo,
    peso_liquido: p.peso_liquido,
    peso_bruto: p.peso_bruto,
    descricao_complementar: p.descricao,
    seo: {
      seo_title: p.seo.title,
      seo_keywords: p.seo.keywords,
      seo_description: p.seo.description,
    },
    imagens_externas: p.imagens.map(url => ({
      imagem_externa: { url }
    })),
  };
}

function buildProdutoJson(p: ProductData, seq: number) {
  return JSON.stringify({
    produtos: [{ produto: buildProdutoBase(p, seq) }]
  });
}

function buildAlterarJson(p: ProductData, id: number, seq: number) {
  return JSON.stringify({
    produtos: [{ produto: buildProdutoBase(p, seq, id) }]
  });
}

async function createProduct(product: ProductData, seq: number) {
  const produtoJson = buildProdutoJson(product, seq);
  const res = await fetch(`${API_BASE}/produto.incluir.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `token=${TOKEN}&produto=${encodeURIComponent(produtoJson)}&formato=JSON`,
  });
  return await res.json();
}

async function updateProduct(product: ProductData, id: number, seq: number) {
  const produtoJson = buildAlterarJson(product, id, seq);
  const res = await fetch(`${API_BASE}/produto.alterar.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `token=${TOKEN}&produto=${encodeURIComponent(produtoJson)}&formato=JSON`,
  });
  return await res.json();
}

async function main() {
  console.log("=== Cadastro completo de produtos na Olist ===");
  console.log(`Produtos: ${products.length}\n`);

  const results: { slug: string; id: number | null; status: string }[] = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const seq = i + 1;
    console.log(`[${seq}/${products.length}] ${product.nome}`);

    const existing = await searchProduct(product.codigo);

    if (existing) {
      console.log(`  Existe (ID: ${existing.id}). Atualizando...`);
      try {
        const data = await updateProduct(product, existing.id, seq);
        if (data.retorno?.status === "OK") {
          console.log(`  OK! ID: ${existing.id}`);
          results.push({ slug: product.slug, id: existing.id, status: "updated" });
        } else {
          const err = data.retorno?.erros?.[0]?.erro ||
            data.retorno?.registros?.[0]?.registro?.erros?.map((e: { erro: string }) => e.erro).join(" | ") ||
            JSON.stringify(data.retorno).substring(0, 200);
          console.log(`  ERRO: ${err}`);
          results.push({ slug: product.slug, id: existing.id, status: `error: ${err}` });
        }
      } catch (err) {
        console.log(`  ERRO: ${err}`);
        results.push({ slug: product.slug, id: existing.id, status: `exception: ${err}` });
      }
    } else {
      console.log(`  Criando...`);
      try {
        const data = await createProduct(product, seq);
        if (data.retorno?.status === "OK") {
          const reg = data.retorno?.registros?.[0]?.registro;
          const newId = reg?.id ? parseInt(reg.id) : null;
          console.log(`  OK! ID: ${newId}`);
          results.push({ slug: product.slug, id: newId, status: "created" });
        } else {
          const err = data.retorno?.erros?.[0]?.erro ||
            data.retorno?.registros?.[0]?.registro?.erros?.map((e: { erro: string }) => e.erro).join(" | ") ||
            JSON.stringify(data.retorno).substring(0, 200);
          console.log(`  ERRO: ${err}`);
          results.push({ slug: product.slug, id: null, status: `error: ${err}` });
        }
      } catch (err) {
        console.log(`  ERRO: ${err}`);
        results.push({ slug: product.slug, id: null, status: `exception: ${err}` });
      }
    }

    await sleep(6000);
  }

  console.log("\n=== RESUMO ===");
  for (const r of results) {
    console.log(`  ${r.slug}: ${r.id || "N/A"} [${r.status}]`);
  }

  console.log("\n=== IDs PARA lib/products.ts ===");
  for (const r of results) {
    if (r.id) {
      console.log(`  ${r.slug}: ${r.id}`);
    }
  }
}

main().catch(console.error);