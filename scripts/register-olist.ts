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
    slug: "yara-rosa",
    nome: "Yara Rosa - Perfume Feminino Lattafa 100ml",
    codigo: "LAT-YARO-100ML",
    preco: "239.90",
    estoque: "5",
    peso: "0.400",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108730515",
    imagens: [`${SITE_URL}/yara-rosa.jpg`],
  },
  {
    slug: "no-2-men",
    nome: "No. 2 Men - Perfume Masculino Maison Alhambra 100ml",
    codigo: "MAH-NO2-100ML",
    preco: "199.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Maison Alhambra",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108730249",
    imagens: [`${SITE_URL}/no-2-men.jpg`],
  },
  {
    slug: "intrude",
    nome: "L'Intrude - Perfume Feminino Maison Alhambra 100ml",
    codigo: "MAH-INTR-100ML",
    preco: "219.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Maison Alhambra",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108730171",
    imagens: [`${SITE_URL}/intrude.jpg`],
  },
  {
    slug: "odyssey-spectra",
    nome: "Odyssey Spectra - Perfume Unissex Armaf 100ml",
    codigo: "ARM-ODY-100ML",
    preco: "289.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Armaf",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6294015188653",
    imagens: [`${SITE_URL}/odyssey-spectra.jpg`],
  },
  {
    slug: "yara-moi",
    nome: "Yara Moi - Perfume Feminino Lattafa 100ml",
    codigo: "LAT-YARM-100ML",
    preco: "239.90",
    estoque: "5",
    peso: "0.400",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Lattafa",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6290360591421",
    imagens: [`${SITE_URL}/yara-moi.jpg`],
  },
  {
    slug: "club-de-nuit-intense-man",
    nome: "Club de Nuit Intense Man - Perfume Masculino Armaf 105ml",
    codigo: "ARM-CDN-105ML",
    preco: "289.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Armaf",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6085010044712",
    imagens: [`${SITE_URL}/club-de-nuit-intense-man.jpg`],
  },
  {
    slug: "yeah-man",
    nome: "Yeah! Man - Perfume Masculino Maison Alhambra 100ml",
    codigo: "MAH-YEA-100ML",
    preco: "199.90",
    estoque: "5",
    peso: "0.350",
    altura: "17",
    largura: "10",
    comprimento: "12",
    marca: "Maison Alhambra",
    ncm: "33030010",
    cest: "2005800",
    gtin: "6291108730324",
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
