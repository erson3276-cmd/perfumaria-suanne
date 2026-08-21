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
  peso: string;
  altura: string;
  largura: string;
  comprimento: string;
  marca: string;
  ncm: string;
  cest: string;
  gtin: string;
  imagens: string[];
  slug: string;
};

const products: ProductData[] = [
  {
    slug: "khamrah",
    nome: "Khamrah - Perfume Arabe Lattafa 100ml",
    codigo: "LAT-KHA-100ML",
    preco: "229.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108737194",
    imagens: [`${SITE_URL}/khamrah-novo.jpg`],
  },
  {
    slug: "asad",
    nome: "Asad - Perfume Masculino Lattafa 100ml",
    codigo: "LAT-ASA-100ML",
    preco: "269.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108735411",
    imagens: [`${SITE_URL}/asad-novo.jpg`],
  },
  {
    slug: "yara-candy",
    nome: "Yara Candy - Perfume Feminino Lattafa 100ml",
    codigo: "LAT-YAR-100ML",
    preco: "229.90",
    estoque: "5",
    peso: "0.400",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6290360599168",
    imagens: [`${SITE_URL}/yara-candy.jpg`],
  },
  {
    slug: "attar-al-wesal",
    nome: "Attar Al Wesal - Perfume Arabe Al Wataniah 100ml",
    codigo: "ALW-ATT-100ML",
    preco: "209.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Al Wataniah",
    ncm: "33030010",
    cest: "2005800",
    gtin: "5055810014933",
    imagens: [`${SITE_URL}/attar-al-wesal-novo.jpg`],
  },
  {
    slug: "sabah-al-ward",
    nome: "Sabah Al Ward - Perfume Feminino Al Wataniah 100ml",
    codigo: "ALW-SAB-100ML",
    preco: "229.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Al Wataniah",
    ncm: "33030010",
    cest: "2005800",
    gtin: "5055810013110",
    imagens: [`${SITE_URL}/sabah-al-ward.png`],
  },
  {
    slug: "durrat-al-aroos",
    nome: "Durrat Al Aroos - Perfume Feminino Al Wataniah 85ml",
    codigo: "ALW-DUR-85ML",
    preco: "219.90",
    estoque: "5",
    peso: "0.300",
    altura: "15",
    largura: "9",
    comprimento: "11",
    marca: "Al Wataniah",
    ncm: "33030010",
    cest: "2005800",
    gtin: "5055810012762",
    imagens: [`${SITE_URL}/Durrat-Al-Aroos%20(2).jpg`],
  },
  {
    slug: "fakhar-black",
    nome: "Fakhar Black - Perfume Masculino Lattafa 100ml",
    codigo: "LAT-FAK-100ML",
    preco: "289.90",
    estoque: "5",
    peso: "0.300",
    altura: "22",
    largura: "8",
    comprimento: "14",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291107456058",
    imagens: [`${SITE_URL}/Fakhar%20Black.jpg`],
  },
  {
    slug: "ana-abiyedh-rouge",
    nome: "Ana Abiyedh Rouge - Perfume Unissex Lattafa 60ml",
    codigo: "LAT-ANA-60ML",
    preco: "189.90",
    estoque: "5",
    peso: "0.350",
    altura: "14",
    largura: "8",
    comprimento: "10",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291107454412",
    imagens: [`${SITE_URL}/ana-abiyedh-rouge.jpg`],
  },
  {
    slug: "afeef",
    nome: "Afeef EDP - Perfume Unissex Lattafa 100ml",
    codigo: "LAT-AFE-100ML",
    preco: "579.90",
    estoque: "5",
    peso: "0.400",
    altura: "17",
    largura: "9",
    comprimento: "17",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6290360598888",
    imagens: [`${SITE_URL}/Afeef.jpg`],
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

function buildProdutoJson(p: ProductData, seq: number) {
  return JSON.stringify({
    produtos: [{
      produto: {
        sequencia: seq,
        nome: p.nome,
        codigo: p.codigo,
        preco: p.preco,
        tipo: "P",
        situacao: "A",
        unidade: "UN",
        peso: p.peso,
        altura: p.altura,
        largura: p.largura,
        comprimento: p.comprimento,
        ncm: p.ncm,
        cest: p.cest,
        gtin: p.gtin,
        classe_produto: "S",
        origem: "3",
        marca: p.marca,
        categoria: "Perfumes",
        estoque: p.estoque,
        estoque_minimo: "2",
        imagens_externas: p.imagens.map(url => ({
          imagem_externa: { url }
        })),
      }
    }]
  });
}

function buildAlterarJson(p: ProductData, id: number, seq: number) {
  return JSON.stringify({
    produtos: [{
      produto: {
        id,
        sequencia: seq,
        nome: p.nome,
        codigo: p.codigo,
        preco: p.preco,
        tipo: "P",
        situacao: "A",
        unidade: "UN",
        peso: p.peso,
        altura: p.altura,
        largura: p.largura,
        comprimento: p.comprimento,
        ncm: p.ncm,
        cest: p.cest,
        gtin: p.gtin,
        classe_produto: "S",
        origem: "3",
        marca: p.marca,
        categoria: "Perfumes",
        estoque: p.estoque,
        estoque_minimo: "2",
        imagens_externas: p.imagens.map(url => ({
          imagem_externa: { url }
        })),
      }
    }]
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
            data.retorno?.registros?.[0]?.registro?.erros?.map((e: any) => e.erro).join(" | ") ||
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
            data.retorno?.registros?.[0]?.registro?.erros?.map((e: any) => e.erro).join(" | ") ||
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
