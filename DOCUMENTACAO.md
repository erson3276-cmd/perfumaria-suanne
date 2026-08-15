# 📋 DOCUMENTAÇÃO — Perfumaria Suanne

> Documento de acompanhamento do projeto. Leia este arquivo para entender o que já foi feito,
> o que está pendente e como mexer no site. Atualizado a cada sessão de trabalho.

---

## 1. Visão geral

E-commerce da **Perfumaria Suanne** — loja de perfumes importados e árabes de luxo com
endereço físico em Pilares, Rio de Janeiro/RJ, e venda online para todo o Brasil.

| Item | Valor |
|---|---|
| Domínio de produção | https://perfumariasuanne.com.br |
| Projeto Vercel | `perfumaria-suanne` (conta `erson3276-5021s-projects`) |
| Stack | Next.js 16.3.0 (App Router + Turbopack), TypeScript, Tailwind CSS |
| Pagamentos | Mercado Pago (Bricks) — Pix e cartão |
| Contato | WhatsApp (21) 98275-5539 · suanne.chagas4@gmail.com |

## 2. Como rodar, buildar e publicar

```bash
npm install          # instala dependências
npm run dev          # servidor de desenvolvimento em localhost:3000
npm run build        # build de produção + checagem de tipos
npx vercel --prod    # deploy para produção (alias automático para o domínio)
```

## 3. Arquitetura / Estrutura

```
app/
  page.tsx                    Home (hero, categorias, destaque, avaliações)
  layout.tsx                  Layout raiz: Header/Footer, JSON-LD OnlineStore, <Analytics/>
  produtos/
    page.tsx                  Catálogo completo (metadata própria)
    ProductsClient.tsx        Lista/filtro/busca/ordenação (client)
    [slug]/page.tsx           Página de produto (SSG, Product + BreadcrumbList JSON-LD)
    categoria/[categoria]/    Páginas de categoria: feminino, masculino, unissex, presentes
  sobre/ page.tsx             Sobre a marca
  contato/ page.tsx           Contato
  carrinho/ page.tsx          Carrinho
  checkout/ page.tsx          Checkout (form → pagamento → confirmação)
  api/checkout|payment|webhook  APIs de pagamento Mercado Pago
  sitemap.ts · robots.ts      SEO técnico
components/                   Header, Footer, ProductCard, AddToCart, CartDrawer,
                              FreteCalculator, PaymentBrick, ProductViewTracker,
                              Analytics, FloatingWhatsApp, Rating, Ornament, icons
lib/
  products.ts                 ⚠️ CATÁLOGO (dados dos produtos — ver seção 4)
  cart.tsx                    Contexto do carrinho (localStorage + eventos)
  site.ts                     Dados da loja, frete, helpers (formatBRL, whatsappLink)
  analytics.ts                Meta Pixel + GA4 (eventos de conversão)
public/perfumes/              Fotos dos produtos
```

## 4. Gestão do catálogo (estoque, preço, fotos)

**Tudo está no arquivo `lib/products.ts`.** Cada produto é um objeto assim:

```ts
{
  slug: "khamrah",            // URL: /produtos/khamrah
  name: "Khamrah",            // nome exibido
  brand: "Lattafa",           // marca
  category: "Unissex",        // Feminino | Masculino | Unissex | Presentes
  price: 469.9,               // preço (R$)
  originalPrice: 549.9,       // opcional — preço riscado/de comparativo
  rating: 4.8,                // nota (0–5)
  reviews: 187,               // nº de avaliações
  size: "100ml",
  image: "/perfumes/khamrah.jpg",   // arquivo em public/perfumes/
  badge: "Novo",              // opcional: "Novo", "Best Seller", etc.
  featured: false,            // true = aparece na home
  inStock: true,              // false = esgotado (some o botão de compra)
  description: "...",         // texto de venda (aparece no título/descrição SEO)
  notes: { top: [...], heart: [...], base: [...] }  // pirâmide olfativa
}
```

**Regras práticas:**
- Mudou preço/estoque/foto? Edite o objeto e rode `npm run build` + `npx vercel --prod`.
- A foto nova deve ir para `public/perfumes/` com o mesmo nome (ou atualize o campo `image`).
- Título SEO é gerado automaticamente: `Perfume {name} {brand} {size} | {category}`.
- `featured: true` em até ~8 produtos para a home.

## 5. SEO — o que já foi feito ✅

- **Sitemap e robots**: `sitemap.xml` (home, produtos, categorias, institucionais) e `robots.txt` com sitemap referenciado
- **Canonical** em todas as páginas (evita conteúdo duplicado)
- **Metadata otimizada por página** com keywords de alto valor:
  - Home: "Perfumes Importados e Árabes de Luxo" (H1 com a keyword principal)
  - Produto: "Perfume {nome} {marca} {tamanho} | {categoria}"
  - Categorias: feminino/masculino/unissex/presentes com title/description próprios
  - `/produtos`, `/sobre`, `/contato` com descrições ricas
- **URLs limpas de categoria**: `/produtos/categoria/feminino` etc. (antes eram filtros `?categoria=` que não indexavam bem). Todos os links internos (header, footer, home, breadcrumb, abas) apontam para as URLs limpas.
- **JSON-LD**: `OnlineStore` (global), `Product` + `BreadcrumbList` (página de produto)
- **Redirecionamento** `www → sem www` via `vercel.json`
- **Deploy ativo** com tudo verificado em produção

## 6. Rastreamento e conversão — o que foi feito ✅

Infraestrutura completa de **Meta Pixel + Google Analytics (GA4)** instalada no código,
com eventos de conversão para campanhas de tráfego pago:

| Evento Meta Pixel | Evento GA4 | Quando dispara | Onde no código |
|---|---|---|---|
| `PageView` | `page_view` | todas as páginas | `components/Analytics.tsx` |
| `ViewContent` | `view_item` | abriu página de produto | `components/ProductViewTracker.tsx` |
| `AddToCart` | `add_to_cart` | adicionou ao carrinho | `lib/cart.tsx` (`add`) |
| `InitiateCheckout` | `begin_checkout` | iniciou o pagamento | `app/checkout/page.tsx` |
| `Purchase` | `purchase` | pagamento aprovado | `app/checkout/page.tsx` (com dedupe anti-duplicidade) |

**Estado:**
- ✅ **Meta Pixel ATIVO** — ID `2259516491492637` configurado e publicado (verificado no bundle de produção)
- ⏸️ **GA4 e Google Ads CONGELADOS** (decisão: começar apenas com Meta Ads) — quando quiser ativar, criar propriedade em analytics.google.com com `suanne.chagas4@gmail.com` e preencher o `NEXT_PUBLIC_GA4_ID` no `.env.local` + `npx vercel --prod`

## 7. SEO off-page — pendências (ação do usuário)

- [ ] **Google Search Console** (search.google.com/search-console): verificar o domínio e enviar `sitemap.xml`; solicitar indexação das páginas principais
- [ ] **Google Business Profile** (business.google.com): criar ficha com endereço, WhatsApp, fotos; descrição e categorias definidas na seção 8
- [ ] **Bing Webmaster Tools**: verificar e importar do GSC
- [ ] Preencher Pixel ID e GA4 ID (seção 6)

## 8. Google Business Profile — conteúdo pronto ✅

- **Nome:** Perfumaria Suanne · **Categoria principal:** Perfumaria
- **Categorias secundárias:** Comércio de cosméticos · Loja de presentes · Entrega de varejo
- **Telefone:** (21) 98275-5539 · **Site:** https://perfumariasuanne.com.br
- **Instagram:** https://instagram.com/suannechagas
- **Endereço:** Avenida João Ribeiro, 444 – Loja D, Pilares, Rio de Janeiro/RJ · CEP 20750-095
- **Descrição sugerida:**
  > Perfumaria Suanne: perfumes importados e árabes de luxo, 100% originais. Trabalhamos com Lattafa, Armaf, Maison Alhambra, Orientica, Rasasi e Afnan, além de fragrâncias autorais. Atendimento personalizado, embalagem de presente e envio para todo o Brasil com código de rastreio. Frete grátis acima de R$ 300 e presente exclusivo da casa na mesma faixa. Visite a loja em Pilares ou compre pelo site.
- **Produtos/serviços a listar:** Perfumes árabes e importados · femininos/masculinos/unissex · kits de presente · envio com rastreio · atendimento via WhatsApp
- **Extras:** marcar "Compra na loja", "Retirada na loja" e "Entrega em domicílio"; ativar Mensagens; publicar postagem semanal; adicionar fotos de vitrine/produtos

## 9. Tráfego pago — estratégia aprovada 📊

**Plataforma ativa:** Meta Ads (Facebook/Instagram) · **Google Ads congelado** (revisar no futuro)
**Verba:** R$ 500–1.000/mês, integralmente para Meta.

> 🎯 **Kit completo da campanha (estrutura, textos, criativos e passo a passo):
> [`CAMPANHA-META.md`](./CAMPANHA-META.md)**

### Fase 0 (estado atual)
- ✅ Meta Pixel ativo com eventos de conversão no site
- [ ] Criar **Conta de Anúncios** no Meta Business (Configurações → Contas de anúncios) e adicionar **forma de pagamento**
- [ ] Ter/confirmar a **Página do Facebook** (necessária para rodar anúncios no Feed/Instagram)
- [ ] Definir o **evento de conversão** da campanha = `Purchase`

### Estrutura proposta (com R$ 1.000/mês, tudo Meta)

**Campanha 1 · Vendas (otimização por Compra)** · R$ 480/mês
- Público amplo no Brasil + interesses (Perfume, Perfumaria Árabe, Lattafa, Armaf, Maison Alhambra, oud)
- 3–4 criativos: foto de produto sobre fundo elegante + texto curto + CTA "Comprar agora"

**Campanha 2 · Retargeting** · R$ 170/mês
- Quem visitou produto (30d) ou abandonou carrinho (14d)
- Texto de urgência + frete grátis acima de R$ 300

**Reserva de teste** · R$ 350/mês (primeiras semanas)
- Testar 2 produtos campeões (ex.: Khamrah Lattafa, Amber Rouge) antes de escalar

**Como o "gestor de tráfego" (IA) atua:**
- Configura tudo no site (pixel, eventos, landing pages) ✅ já feito
- Prepara estrutura, públicos, textos, criativos e alocação de verba
- Ajusta conjuntos/textos conforme os números chegarem
- **Limite:** o clique em "publicar" dentro do Ads Manager é do usuário (exige login, página e pagamento)

**Métricas de sucesso:** CPM < R$ 25 · CPC < R$ 1,5 · CPV (compra) proporcional ao ticket médio (~R$ 350) · retargeting com ROAS > 2,5

## 10. Evolução futura (decisões registradas)

- **Catálogo:** mantido em código (`lib/products.ts`), alterado sob demanda. Opção B = painel admin (Sanity/Payload); opção C = migração para Nuvemshop/Shopify. Reavaliar quando as vendas crescerem.
- **Meta CAPI (Conversions API):** upgrade de rastreamento server-side via webhook do Mercado Pago — recomendado quando a verba passar de ~R$ 3.000/mês (iOS bloqueia cada vez mais o pixel de browser).
- **Google Merchant Center / Meta Catálogo:** gerar feed de produtos para Shopping Ads e Dynamic Ads (exigirá export de catálogo).

---

*Última atualização: 12/08/2026 · Gerado e mantido com o auxílio de IA, refletindo o estado real do projeto.*
