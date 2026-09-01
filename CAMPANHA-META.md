# 🎯 CAMPANHA META ADS — Perfumaria Suanne

> Kit pronto para lançamento no Ads Manager. Estrutura, públicos, textos, criativos
> e passo a passo. Ao publicar qualquer anúncio, use estes valores exatos.

---

## 1. Resumo rápido

| Item | Valor |
|---|---|
| Objetivo | **Vendas** (Conversões) |
| Evento de conversão | **Compra** (Purchase) |
| Pixel | Perfumaria Suanne (`2852416835144977`) |
| Orçamento | **R$ 30/dia** (≈ R$ 900/mês) |
| Duração | Contínua, ajustável a cada 2–3 dias |
| Produto principal do 1º anúncio | **Khamrah — Lattafa** (`/produtos/khamrah`) |
| Público | Brasil · 25–54 anos · interesses de perfumaria |
| Formato | Imagem única (3 variações de texto) |

## 2. Passo a passo no Ads Manager

### Criar a campanha
1. **Ads Manager** (business.facebook.com → Marketing/Anúncios) → **Criar**
2. Objetivo: escolha **"Vendas"** (não use tráfego!)
3. **Nome da campanha:** `PERF_SALES_V1`
4. Conversões → marque **Compra** → "Usar conversões existentes"
   - Confirme que aparece o evento `Purchase` do pixel `Perfumaria Suanne`

### Conjunto de anúncios
5. **Nome:** `SET_A_khamrah_amplo`
6. **Conversão:** Compra (Purchase)
7. **Orçamento:** diário → **R$ 30,00**
8. **Público** (sem Advantage+ se preferir controle):
   - Localização: **Brasil** (todo o país)
   - Idade: **25–54** · Gênero: **Todos**
   - Interesses: `Perfume`, `Perfume e fragrâncias`, `Perfumes árabes`, `Lattafa`
   - (ou use **"Público Advantage+"** e deixe o algoritmo otimizar — recomendado p/ começar)
9. **Posicionamentos:** Automático

### Anúncio
10. **Nome:** `AD_Khamrah_V1`
11. **Página do Facebook:** Perfumaria Suanne
12. **Formato:** Imagem única
13. **Imagem:** foto do frasco Khamrah (1080×1080, fundo elegante/âmbar — ver seção 5)
14. Preencha os campos com os textos da seção 4
15. **Link:** `https://perfumariasuanne.com.br/produtos/khamrah?utm_source=facebook&utm_medium=paid&utm_campaign=PERF_SALES_V1&utm_content=AD_Khamrah_V1`
16. **Botão (CTA):** **"Comprar agora"**
17. **Publicar** → aguardar revisão (minutos a horas)

## 3. Públicos e lógica da campanha

- **Público de descoberta:** amplo Brasil + interesses de perfumaria (acima). Meta otimiza sozinha com o evento Compra.
- **Retargeting (semana 3+):** novo conjunto `SET_B_retargeting` com público personalizado:
  - Visitantes de produto (30 dias)
  - Quem abandonou o carrinho (14 dias)
  - Texto de urgência + frete grátis
- **Regra de escala:** se o CPV (custo por compra) ficar abaixo de ~R$ 350 (ticket médio), subir orçamento **+20% a cada 3 dias**. Se passar de R$ 400, pausar o criativo ruim e testar outro.

## 4. Textos dos anúncios

### Texto principal (primário) — teste 3 versões
1. **V1 (emoção + autoridade):**
   Perfume que vira assinatura. 🤎 Essências importadas e árabes de luxo — 100% originais, frete grátis acima de R$ 300 e rastreio para todo o Brasil. O Khamrah Lattafa, queridinho da casa, está em estoque.

2. **V2 (desejo + urgência):**
   Quem experimenta Khamrah não volta pro perfume de farmácia. 😌 Fragrâncias de luxo a preço justo: Lattafa, Armaf, Maison Alhambra e mais. Original garantido — clique e escolha a sua essência.

3. **V3 (benefício + prova):**
   Perfumes que duram o dia todo e deixam rastro. ✨ Mais de 3.000 avaliações de clientes reais. Envio com rastreio para todo o Brasil e presente da casa acima de R$ 300. Compre agora.

### Título (30–40 caracteres)
- `Perfume Árabe Original` (opção A)
- `Khamrah Lattafa em Estoque` (opção B)
- `Frete Grátis Acima de R$ 300` (opção C)

### CTA
- **Comprar agora**

## 5. Criativos (3 variações de imagem)

| # | Imagem | Foco | Dica |
|---|---|---|---|
| 1 | Frasco do Khamrah sobre fundo âmbar/dourado, luz lateral | Produto em destaque | 1080×1080, texto ≤ 20% da imagem |
| 2 | Frasco + caixa + fita de presente | Presenteável | Sugere presente, amplia público |
| 3 | Flat lay: frasco sobre tecido/seda escura com jasmim | Estética luxo | Enquadramento elegante |

- **Usar fotos reais já existentes** (em `public/perfumes/` do projeto).
- **Não usar** foto com marca d'água, textão na imagem ou fundo branco cru de catálogo.

## 6. Checklist antes de publicar

- [ ] Pixel com status **Ativo** (não "Inativo")
- [ ] Evento **Purchase** confirmado via Meta Pixel Helper (fazer 1 compra-teste)
- [ ] Conta de anúncios criada + **forma de pagamento** adicionada
- [ ] **Página do Facebook** da loja ativa
- [ ] Fotos dos produtos em 1080×1080
- [ ] Página do produto Khamrah aberta e carregando (link e foto OK)

## 7. Métricas de sucesso (primeiros 15 dias)

| Métrica | Meta |
|---|---|
| CPM (custo por mil) | < R$ 25 |
| CPC | < R$ 1,50 |
| CTR | > 1,5% |
| Custo por compra (CPV) | ≤ ticket médio (~R$ 350) |
| Frequência | < 2,5 antes de trocar criativo |

**Regra de ouro:** nos primeiros dias NÃO pause nada por impaciência. Meta precisa de
~15–25 compras por conjunto para otimizar. Só mexa após ~7 dias ou 3× o custo-alvo.

## 8. Sequência sugerida (próximos 30 dias)

- **Semana 1–2:** Campanha Vendas (acima) rodando, só ajustar criativos ruins
- **Semana 3:** + Retargeting (SET_B) com R$ 8/dia
- **Semana 4:** duplicar o criativo vencedor, escalar +20%, testar 2º produto (Amber Rouge → `/produtos/amber-rouge`) com R$ 15/dia
- **Depois:** avaliar Lookalike (público semelhante aos compradores) quando houver 100+ compras

---

*Parte do fluxo de gestão da Perfumaria Suanne. Ao terminar cada semana, atualizar os
resultados na seção 9 do DOCUMENTACAO.md.*
