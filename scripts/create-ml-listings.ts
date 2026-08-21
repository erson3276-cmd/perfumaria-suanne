const TOKEN = "APP_USR-3355094444237520-082019-e6a62b12a51e76c65ee914069d6efb32-1464516564";
const API = "https://api.mercadolibre.com";
const SITE_URL = "https://perfumariasuanne.com.br";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const products = [
  {
    name: "Khamrah",
    gtin: "6291108737194",
    price: 229.90,
    quantity: 5,
    catalog_id: "MLB68701865",
    family_name: "Khamrah lattafa",
    gender_id: "110461",
    gender_name: "Sem genero",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/khamrah-novo.jpg`,
  },
  {
    name: "Asad",
    gtin: "6291108735411",
    price: 269.90,
    quantity: 5,
    catalog_id: "MLB67409976",
    family_name: "Asad",
    gender_id: "339666",
    gender_name: "Masculino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/asad-novo.jpg`,
  },
  {
    name: "Yara Candy",
    gtin: "6290360599168",
    price: 229.90,
    quantity: 5,
    catalog_id: "MLB70537597",
    family_name: "Yara Candy",
    gender_id: "339665",
    gender_name: "Feminino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/yara-candy.jpg`,
  },
  {
    name: "Attar Al Wesal",
    gtin: "5055810014933",
    price: 209.90,
    quantity: 5,
    catalog_id: "MLB62216196",
    family_name: "attar al wesal",
    gender_id: "339666",
    gender_name: "Masculino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/attar-al-wesal-novo.jpg`,
  },
  {
    name: "Sabah Al Ward",
    gtin: "5055810013110",
    price: 229.90,
    quantity: 5,
    catalog_id: "MLB46141932",
    family_name: "sabah al ward",
    gender_id: "339665",
    gender_name: "Feminino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/sabah-al-ward.png`,
  },
  {
    name: "Durrat Al Aroos",
    gtin: "5055810012768",
    price: 219.90,
    quantity: 5,
    catalog_id: "MLB61855922",
    family_name: "durrat al aroos",
    gender_id: "339665",
    gender_name: "Feminino",
    volume: "85 ml",
    image: `${SITE_URL}/perfumes/Durrat-Al-Aroos%20(2).jpg`,
  },
  {
    name: "Fakhar Black",
    gtin: "6291107456058",
    price: 289.90,
    quantity: 5,
    catalog_id: "MLB77044818",
    family_name: "fakhar",
    gender_id: "339666",
    gender_name: "Masculino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/Fakhar%20Black.jpg`,
  },
  {
    name: "Ana Abiyedh Rouge",
    gtin: "6291107454412",
    price: 189.90,
    quantity: 5,
    catalog_id: "MLB62046456",
    family_name: "ana abiyedh",
    gender_id: "110461",
    gender_name: "Sem genero",
    volume: "60 ml",
    image: `${SITE_URL}/perfumes/ana-abiyedh-rouge.jpg`,
  },
  {
    name: "Afeef",
    gtin: "6290360598888",
    price: 579.90,
    quantity: 5,
    catalog_id: "MLB70110230",
    family_name: "pride",
    gender_id: "339665",
    gender_name: "Feminino",
    volume: "100 ml",
    image: `${SITE_URL}/perfumes/Afeef.jpg`,
  },
];

async function getCatalogAttrs(catalogId: string): Promise<Record<string, { value_id: string; value_name: string }>> {
  const res = await fetch(`${API}/products/${catalogId}`, {
    headers: { "Authorization": `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  const attrs: Record<string, { value_id: string; value_name: string }> = {};
  data.attributes?.forEach((a: { id: string; value_id?: string | null; value_name?: string }) => {
    if (a.value_id && a.value_name) {
      attrs[a.id] = { value_id: a.value_id, value_name: a.value_name };
    }
  });
  return attrs;
}

async function createListing(product: typeof products[0]) {
  console.log(`\n--- ${product.name} ---`);

  const catAttrs = await getCatalogAttrs(product.catalog_id);

  const attributes: Array<{ id: string; value_id?: string; value_name: string }> = [
    { id: "GTIN", value_name: product.gtin },
    { id: "GENDER", value_id: product.gender_id, value_name: product.gender_name },
    { id: "UNIT_VOLUME", value_name: product.volume },
  ];

  const skipAttrs = new Set(["GTIN", "GENDER", "UNIT_VOLUME", "OLFACTORY_NOTES"]);

  for (const [attrId, val] of Object.entries(catAttrs)) {
    if (!skipAttrs.has(attrId)) {
      attributes.push({ id: attrId, value_id: val.value_id, value_name: val.value_name });
    }
  }

  const item: Record<string, unknown> = {
    catalog_product_id: product.catalog_id,
    category_id: "MLB6284",
    price: product.price,
    currency_id: "BRL",
    available_quantity: product.quantity,
    buying_mode: "fix_price",
    condition: "new",
    listing_type_id: "gold_special",
    family_name: product.family_name,
    attributes,
    pictures: [{ source: product.image }],
    shipping: { mode: "me2", local_pick_up: false, free_shipping: true },
  };

  const res = await fetch(`${API}/items`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const data = await res.json();

  if (data.id) {
    console.log(`  ✅ CREATED! ID: ${data.id}`);
    console.log(`  Title: ${data.title}`);
    console.log(`  Permalink: ${data.permalink}`);
    return { success: true, id: data.id, title: data.title };
  } else {
    const errMsg = data.cause?.map((c: { message: string }) => c.message).join("; ") || data.message;
    console.log(`  ❌ Error: ${errMsg}`);
    return { success: false, error: errMsg };
  }
}

async function main() {
  console.log("=== CREATING ML LISTINGS WITH PICTURES ===\n");

  const results: Array<{ name: string; id?: string; success: boolean; error?: string }> = [];

  for (const product of products) {
    const result = await createListing(product);
    results.push({
      name: product.name,
      id: result.id,
      success: result.success,
      error: result.success ? undefined : result.error,
    });
    await sleep(3000);
  }

  console.log("\n\n=== FINAL RESULTS ===");
  let ok = 0;
  let fail = 0;
  for (const r of results) {
    if (r.success) {
      console.log(`✅ ${r.name}: ID ${r.id}`);
      ok++;
    } else {
      console.log(`❌ ${r.name}: FAILED`);
      console.log(`   ${r.error?.substring(0, 250)}`);
      fail++;
    }
  }
  console.log(`\n${ok} created, ${fail} failed`);
}

main();
