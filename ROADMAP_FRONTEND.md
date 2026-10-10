# Idearium — Roadmap do Frontend

> Espelho do `ROADMAP_BACKEND.md`. Enquanto lá as etapas são numeradas
> `Etapa N`, aqui são `F0..F6`, pra não confundir nas conversas.
>
> **Responsável:** Gabriele (`VISAO.md` §13 — frontend, design e tom).
> Alinhamento com Kae nas decisões que afetam contrato com a API.

---

## Status atual (atualizado 2026-07-31)

| Etapa | Status | Notas |
|---|---|---|
| F0. Fundação e design system | ✅ feito | direção Matéria portada, átrio de pé |
| F1. Leitura pública | ✅ feito | 5 telas ligadas na API real, 21 rotas no build |
| F2. Identidade | ⏳ próxima | destravada — Etapa 1 pronta. Traz o adapter SSR |
| F3. Participação | ⏳ planejada | destravada — Etapa 3 pronta |
| F4. Autoria | ⏳ planejada | destravada — Etapa 2 pronta |
| F5. Descoberta | ⏳ planejada | destravada — Etapa 4 pronta |
| F6. Notificações | 🔒 bloqueada | espera Etapa 5 do backend |

**O frontend é o gargalo, não o backend.** F1 a F5 consomem endpoints que já
existem e já têm teste e2e. Nada além da F6 depende de código novo do Kae.

### Pendências externas (não-código)

- [ ] Decidir onde o `apps/web` é hospedado. A F2 precisa de um runtime Node
      (ver "Decisão: renderização"). Envolve infra do Kae. A imagem já está
      pronta em `apps/web/Dockerfile` (contexto na raiz; `PUBLIC_API_URL` como
      build arg); falta só o host (Railway/Fly, ver `ROADMAP_BACKEND.md`).
- [ ] Alinhar a versão do Node: `apps/api/Dockerfile` usa `node:20-alpine`,
      enquanto `.nvmrc`, o CI e `apps/web/Dockerfile` usam 22.
- [x] Self-host de Inter e Newsreader. Feito com `@fontsource-variable/*`
      (subsets latin e latin-ext), declarado em `global.css`; nenhum request
      vai ao Google Fonts. A Departure Mono já era self-hosted.

---

## 0. Princípios deste roadmap

1. **HU é comportamento, não papel.** O `VISAO.md` §5.2 recusa papéis fixos
   ("autor", "builder" são coisas que a pessoa *faz*, não que ela *é*). Então
   as histórias começam com "quem chega", "quem escreveu", "quem sabe fazer" —
   não com "como um Builder, eu quero".
2. **Critério de aceite verificável.** "Tela bonita" não é aceite. "Recarregar
   a página mantém o filtro" é.
3. **Estado de vazio é parte da HU**, não uma fase de polimento. Toda listagem
   entrega o caso com zero item junto com o caso feliz.
4. **A API é contrato.** Se uma tela precisa de campo que não existe, isso vira
   conversa com o Kae antes de a HU começar — não um `TODO` no componente.
5. **Nada de métrica de vaidade** (`VISAO.md` §9). Contagem que ajuda a navegar
   (quantas ideias tem um lab) fica; contagem que existe pra impressionar
   (`47 ideias abertas`, `128 builders`) não entra.

---

## 1. Stack

Já decidida e em uso desde a F0:

| Item | Escolha | Por quê |
|---|---|---|
| Framework | Astro 6 | conteúdo público estático por padrão, SSR só onde precisa |
| Ilhas | React 19 | só onde há estado real; a maior parte do site não precisa |
| CSS | Tailwind 4 + CSS nomeado | Tailwind pro layout, CSS à mão pra identidade e animação |
| Fontes | Inter, Newsreader (OFL), Departure Mono (MIT) | licenças compatíveis com CC BY-SA |

### Decisão: renderização

**Híbrido.** Páginas públicas pré-renderizadas; rotas com sessão em SSR.

- **Público** (átrio, lista, RFC, lab, perfil, busca): `prerender = true`. É bem
  comum digital — as RFCs precisam indexar em buscador, e o Astro entrega HTML
  pronto sem custo de runtime.
- **Com sessão** (entrar, escrever, editar, notificações): SSR via
  `@astrojs/node`, com o refresh token em **cookie httpOnly**.

**Por que não islands puras com token no `localStorage`:** o backend implementou
refresh token opaco, hashado, com rotação e `revokedAt` (`ROADMAP_BACKEND` §2.5).
Guardar isso em `localStorage` num app que renderiza texto escrito por usuários
(comentários, corpo de RFC) devolve por XSS a segurança que o Kae construiu.

**Quando o adapter entra:** na **F2**, junto com a primeira tela autenticada.
Instalar antes seria infra sem uso.

---

## 2. Etapas

### **F0 — Fundação e design system** — ✅ CONCLUÍDA

**Objetivo:** o app deixa de ser vitrine da stack e passa a ter identidade
própria, coerente com o SSOT.

**Entregue:**
- Tokens da direção Matéria em `global.css` (`@theme static`), substituindo o
  idioma Kare OS.
- Fontes PP Mondwest e PP NeueBit removidas do repositório — eram *free for
  personal use* dentro de um repo público.
- `Materia.astro`: o dado da RFC renderizado em dithering Bayer 8×8, com quatro
  campos (mancha, pontos, grafo, série).
- Átrio reescrito em `index.astro`, com as três transições aprovadas: swap de
  estado com blur, errata em fole `0fr → 1fr`, passo dado com `stroke-dashoffset`.
- Peças do Kare OS movidas pra `brainstorming-design/kare-os/app-astro/`.

**Débito assumido:**
- Dados ainda são fixtures, mas já no shape das respostas da API.
- Ícones em `public/icons/` ficaram órfãos (o átrio antigo os usava). A F1
  decide se voltam ou saem.
- `pedindoMao` nos labs é campo inventado pela UI — ver F1.

---

### **F1 — Leitura pública** — ✅ CONCLUÍDA

**Objetivo:** um visitante anônimo percorre todo o conteúdo público sem nunca
criar conta. É o caminho da persona Luísa no `VISAO.md` §7.

**HUs:**

| # | História | Aceite | |
|---|---|---|---|
| F1.1 | Quem chega vê no átrio ideias reais, não fixture | átrio consome a API; com ela fora do ar a página ainda renderiza, com aviso | ✅ |
| F1.2 | Quem procura uma ideia filtra a lista por lab e por estado | `/rfcs` com `?lab=&status=`; filtro sobrevive a recarregar; zero resultado tem vazio próprio | ✅ |
| F1.3 | Quem abre uma ideia lê a proposta inteira e o histórico | `/rfcs/:slug` com corpo, versões, inscritos, discussão e tags | ✅ |
| F1.4 | Quem quer entender um domínio abre o laboratório | `/labs` e `/labs/:slug` | ✅ |
| F1.5 | Quem viu um `@nome` numa discussão abre o perfil | `/users/:username` com o que escreveu e onde constrói | ✅ |

**Entregue:**
- `src/lib/api.ts` — único ponto de contato com o backend. Tipos escritos a
  partir das respostas reais, não do schema. Nenhuma função lança: API fora
  devolve fallback vazio e marca `apiIndisponivel`.
- Componentes compartilhados: `Nav`, `Rodape`, `CartaoIdeia`, `Vazio`.
- Build gera 21 rotas: átrio, `/rfcs`, `/labs`, 6 labs, 6 RFCs, 6 perfis.

**O que a integração revelou** (nenhum vira pendência com o Kae — todos
contornados no cliente):

| Descoberta | Como ficou |
|---|---|
| `limit` tem teto de 100; pedir mais devolve **400** | `listarTodasRfcs()` pagina até o fim. Era falha silenciosa: o build gerava um site sem nenhuma RFC e terminava "com sucesso" |
| `GET /rfcs/featured` devolve 3, o átrio precisa de 4 | átrio usa `GET /rfcs?limit=4`, mesma ordem de recência |
| `pedindoMao` não existe e nunca existiu | saiu da UI; o lab mostra `rfcsCount` |
| `buildersCount` do lab volta 0 mesmo com inscrições ativas | não exibido. Parece contar `BuilderProfile`, não `Enrollment` — confirmar com o Kae antes de usar |
| `GET /users/:username/enrollments` devolve a RFC **sem** `author` nem `_count` | `CartaoIdeia` trata os dois como opcionais |
| `glyph` do lab já vem do banco | a UI não tem mais tabela de glyph hardcoded |
| Slug real é `tec-civica` / `econ-solidaria` | tokens de cor renomeados pra casar com o slug |

**Débito assumido:**
- Filtro de `/rfcs` é client-side sobre o catálogo inteiro. Passando de ~200
  RFCs vira HTML demais e precisa virar SSR paginado.
- Markdown do corpo é renderizado por um parser mínimo escrito à mão
  (`rfcs/[slug].astro`), que escapa tudo antes de injetar. Cobre h2, lista,
  parágrafo, negrito e código. Um renderer de verdade entra na F4 — e vai
  precisar sanitizar igual.
- Rota de perfil só existe pra quem **escreveu** alguma RFC: não há endpoint
  público que liste usuários, e nem deveria haver. Quem só comentou ganha
  página na F2, com SSR.
- `/builders`, `/entrar`, `/rfcs/nova` e os quatro links institucionais ainda
  são 404. Estão nas etapas seguintes.

---

### **F2 — Identidade** *(~1,5 semana)* — ⏳ PLANEJADA

**Objetivo:** a pessoa passa a ter uma sessão. Traz o adapter SSR junto.

**HUs:**

| # | História | Aceite |
|---|---|---|
| F2.1 | Quem já tem conta entra com email e senha | cookie httpOnly; recarregar mantém a sessão |
| F2.2 | Quem nunca entrou cria conta | validação da API exibida em pt-BR (o backend já responde i18n) |
| F2.3 | Quem entrou sai, e a sessão morre de verdade | `POST /auth/logout` revoga o refresh token no servidor |
| F2.4 | A sessão renova sozinha sem derrubar a pessoa | access token de 15min renovado por `POST /auth/refresh` sem interromper a navegação |
| F2.5 | Quem entrou edita o próprio perfil | `PATCH /users/me` e `PATCH /builders/me` |

**Stack adicionada:** `@astrojs/node`, `output: 'server'` com
`export const prerender = true` nas rotas públicas.

**Definition of done:**
- [ ] Nenhum token acessível por JS do lado do cliente.
- [ ] Rota autenticada acessada sem sessão redireciona pra `/entrar`.
- [ ] Rotas públicas continuam pré-renderizadas (conferir no output do build).

---

### **F3 — Participação** *(~1 semana)* — ⏳ PLANEJADA

**Objetivo:** quem sabe fazer entra numa ideia, e a discussão acontece.

**HUs:**

| # | História | Aceite |
|---|---|---|
| F3.1 | Quem sabe fazer se inscreve numa ideia | `POST /rfcs/:id/enroll`; o chip de estado muda de `em discussão` pra `em construção` na tela, usando o swap com blur da F0 |
| F3.2 | Quem se inscreveu sai quando quiser, publicamente | `DELETE /rfcs/:id/enroll`; a saída aparece, não é apagada |
| F3.3 | Quem tem o que dizer comenta | `POST /rfcs/:id/comments`, discussão linear |
| F3.4 | Quem errou edita ou remove o próprio comentário | `PATCH`/`DELETE /comments/:id`; removido mostra `[removido]`, que é o que a API devolve |

**Detalhe de contrato:** a transição `IN_DISCUSSION ↔ IN_BUILDING` é automática
no servidor (`recomputeRfcStatus`). O frontend **não decide** o status — relê a
RFC depois do enroll.

---

### **F4 — Autoria** *(~2 semanas)* — ⏳ PLANEJADA

**Objetivo:** a frase-âncora vira ação: *"não precisa saber fazer. precisa só
querer que aconteça."*

**HUs:**

| # | História | Aceite |
|---|---|---|
| F4.1 | Quem viu um problema escreve uma ideia | `POST /rfcs` cria rascunho; rascunho só é visível pra quem escreveu |
| F4.2 | Quem escreveu edita, e o histórico fica | `PATCH /rfcs/:id`; mudar o corpo gera versão nova, e a errata da F0 mostra o diff |
| F4.3 | Quem terminou publica, e a ideia ganha número | `POST /rfcs/:id/publish`; o número vem da sequence do Postgres, nunca do cliente |
| F4.4 | Quem desistiu arquiva | `POST /rfcs/:id/archive` |
| F4.5 | Quem escreveu classifica com tags | `POST /rfcs/:id/tags` substitui o conjunto inteiro |

**Peça nova de UI:** editor de corpo em markdown. Decidir se renderiza no
cliente ou no servidor — se no cliente, sanitização é requisito de aceite, não
detalhe.

---

### **F5 — Descoberta** *(~1 semana)* — ⏳ PLANEJADA

**HUs:**

| # | História | Aceite |
|---|---|---|
| F5.1 | Quem procura por palavra encontra | `GET /search?q=&locale=&lab=`; sem resultado tem estado de vazio com sugestão |
| F5.2 | Quem clicou numa tag vê tudo dela | `GET /tags/:slug` |
| F5.3 | Quem navega entende que a busca é por idioma | a busca é FTS por `locale` e **não** cruza idiomas (limite conhecido, `ROADMAP_BACKEND` §2.5) — a UI precisa dizer isso, não esconder |

---

### **F6 — Notificações** — 🔒 BLOQUEADA (Etapa 5 do backend)

Central de notificações por polling, sem WebSocket, espelhando `GET /notifications`.

Cuidado de produto: o `VISAO.md` §9 proíbe "notificações de engagement estilo
Instagram". Notificar que alguém comentou na sua RFC é serviço; notificar que
"alguém viu seu perfil" é vaidade e não entra.

---

## 3. Cronograma

Sequencial, mas F4 e F5 podem trocar de ordem sem prejuízo.

| Etapa | Tempo | Acumulado |
|---|---|---|
| F0 | — | ✅ |
| F1 | — | ✅ |
| F2 | 1,5 semana | 1,5 |
| F3 | 1 semana | 2,5 |
| F4 | 2 semanas | 4,5 |
| F5 | 1 semana | 5,5 |

Para go-live público falta ainda, fora desta lista: página `/sobre`,
`/governanca`, `/codigo-de-conduta` e `/transparencia` — hoje são links mortos
no rodapé do átrio.
