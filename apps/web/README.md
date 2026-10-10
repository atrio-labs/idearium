# @idearium/web

Frontend do Idearium: átrio, RFCs, laboratórios, perfis e as telas com sessão.
Astro 6 + React 19 + Tailwind 4, servido por um processo Node
(`@astrojs/node`, modo `standalone`). Fala com a API NestJS de `apps/api`.

## Rodar em dev, junto com a API

```bash
# 1. banco
docker run -d --name idearium-postgres \
  -e POSTGRES_DB=idearium -e POSTGRES_USER=idearium -e POSTGRES_PASSWORD=idearium_dev \
  -p 5432:5432 -v idearium_postgres_data:/var/lib/postgresql/data postgres:16-alpine

# 2. api
cp apps/api/.env.example apps/api/.env      # gerar JWT_ACCESS_SECRET
cd apps/api && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
npm run dev:api                              # :3000

# 3. web (na raiz do monorepo)
npm run dev:web                              # :4321
```

As páginas são renderizadas no servidor a cada requisição, então **a API
precisa estar no ar para `dev` e para servir o app**. O `build` não chama a API.
Com a API fora do ar, `api.ts` nunca lança: a página sai sem conteúdo e com aviso.

## Variáveis

| Variável | Quando vale | Padrão | O que faz |
| :-- | :-- | :-- | :-- |
| `PUBLIC_API_URL` | **build** | `http://localhost:3000` | URL base da API (`src/lib/api.ts`, `src/lib/sessao.ts`). O prefixo `PUBLIC_` faz o Vite gravá-la no bundle, então trocar o valor exige novo build. |
| `HOST` | execução | `0.0.0.0` na imagem | Endereço em que o servidor Node escuta. |
| `PORT` | execução | `4321` | Porta do servidor Node. |
| `SITE_URL` | execução | `Astro.url.origin` | Origem pública do site (ex.: `https://idearium.org`, sem caminho). Só importa com `PUBLIC_OAUTH=1`: monta o `redirect` de volta do provedor (`/entrar/callback`). Atrás de proxy, `Astro.url.origin` sai com o host interno e o OAuth quebra; defina esta variável. Sem prefixo `PUBLIC_`, é lida a cada requisição, então trocar não exige novo build. Valor que não é URL é ignorado. |
| `NODE_ENV` | execução | `production` na imagem | Mantenha `production` em produção. |
| `PUBLIC_NOTIFICACOES` | **build** | desligada | `1` liga as notificações (F6): a rota `/notificacoes`, o endpoint `/api/notificacoes/contagem` e o marcador na nav. Com qualquer outro valor, a rota e o endpoint respondem 404 e a nav não mostra nada. Só ligue quando a API tiver `GET /notifications` (Etapa 5 do backend); antes disso a tela diz que a API ainda não oferece notificações. Como é `PUBLIC_`, trocar exige novo build. |
| `PUBLIC_TRADUCOES` | **build** | desligada | `1` lista, na RFC original, as traduções existentes. Precisa de `translations` no `GET /rfcs/:slug`; sem o campo, nada aparece. O "tradução de RFC-XXXX" e o "traduzir esta ideia" não dependem da flag. Contrato em `docs/contratos/ideia.md`. |
| `PUBLIC_ACOMPANHAR` | **build** | desligada | `1` liga o botão "acompanhar" na RFC (`POST/DELETE /rfcs/:id/follow`, estado em `GET /rfcs/:id/follow`) e a lista "o que acompanho" no `/perfil` (`GET /me/follows`). Sem contador público. Só ligue com o backend no ar. Contrato em `docs/contratos/ideia.md`. |
| `PUBLIC_OAUTH` | **build** | desligada | `1` liga a Etapa 6 no frontend: entrar com GitHub e Google (`/entrar/<provedor>`, `/entrar/callback`), `/recuperar-senha`, `/redefinir-senha`, `/verificar-email/<token>`, contas conectadas e aviso de email não verificado no perfil. Desligada, nada disso aparece e as rotas novas respondem 404. Só ligue quando a Etapa 6 do backend estiver no ar. Contrato em `ROADMAP_FRONTEND.md`. |
| `PUBLIC_CICLO` | **build** | desligada | `1` liga o fechamento do ciclo da ideia: "virou projeto" e "trazer de volta" no editar, atualizações de progresso na página da ideia e nota de mudança nas versões. Não cria rotas; desligada, nada disso aparece. Só ligue quando a API tiver os endpoints de `docs/contratos/ciclo.md`; antes disso, a tela diz que a API ainda não oferece o recurso. Como é `PUBLIC_`, trocar exige novo build. |
| `PUBLIC_MODERACAO` | **build** | desligada | `1` liga a moderação (C2): o link "reportar" nas ideias, nos comentários e nos perfis, `/reportar`, o painel `/moderacao` (só `MAINTAINER`) e `/contestar`, além dos estados "ocultada pela moderação" e "[suspenso]". Desligada, nada aparece e as rotas respondem 404; o código de conduta segue apontando o email. Só ligue quando a API tiver `POST /reports` e os endpoints `/admin/*`; antes disso as telas dizem que a API ainda não oferece o recurso. Contrato proposto em `docs/contratos/moderacao.md`. |
| `PUBLIC_CONTA` | **build** | desligada | `1` liga a frente C3: no `/perfil`, as seções de segurança (trocar senha, trocar email, sair de todos os aparelhos) e de dados (baixar meus dados); a rota `/excluir-conta`; `/confirmar-email/<token>`; e o download `/api/meus-dados`. Desligada, nada disso aparece e as rotas respondem 404. Só ligue quando a API tiver os endpoints do contrato proposto em `docs/contratos/conta.md`; sem eles, cada ação diz que a função ainda não está disponível. Os termos (`/termos`) e a política (`/privacidade`) não dependem da flag. |

### Cookies e HTTPS

Os tokens vivem em cookies `httpOnly` com `sameSite=lax` (`src/lib/sessao.ts`).
O atributo `secure` fica ligado quando o build é de produção
(`import.meta.env.PROD`). Por isso, em produção o app **precisa ser servido por
HTTPS**: em `http://` o browser descarta o cookie e o login não gruda. Rodar a
imagem em `http://localhost` serve para testar a renderização, mas não o login.

## Build e execução

```bash
npm run build:web                      # na raiz; gera apps/web/dist/
node apps/web/dist/server/entry.mjs    # HOST e PORT valem aqui
```

Checagem de tipos: `npm run check -w apps/web` (`astro check`, roda no CI).

## Testes

**Unitários** (Vitest, `tests/unit/`): funções puras de `src/lib` (markdown e
XSS, diff de versões, i18n, `destinoSeguro`, `cachePublico`) e um bloqueador de
acentos que falha se texto pt-BR dos dicionários ou das páginas institucionais
tiver palavra comum sem acento ("nao", "voce", "sessao"...). Não precisam de API
e rodam no CI.

```bash
npm run test -w apps/web
```

**E2E** (Playwright, `tests/e2e/`): rodam contra um web já no ar, sem subir
servidor. Projetos `desktop` e `mobile` (390x844). Cobrem as páginas públicas
em pt-BR e `/en` (status, `lang`, rolagem horizontal no celular, axe sem
violação serious/critical, cache público, nenhuma fonte do Google) e os fluxos
com conta: criar conta e sair, criar e publicar ideia com diff de versões,
inscrever-se e comentar.

```bash
# web em :4321 e API em :3000 já no ar (seção "Rodar em dev")
npx playwright install chromium          # uma vez
npm run e2e -w apps/web
BASE_URL=http://localhost:4321 API_URL=http://localhost:3000 npm run e2e -w apps/web
```

Os fluxos com conta **gravam no banco** da API (contas e ideias com prefixo
`e2e<tempo>`). Rode só contra o banco local de dev. Com o web ou a API fora,
ou se a API recusar a criação de conta, os testes são pulados com o motivo.
O e2e não roda no CI porque exigiria subir API e banco no job do web.

### Imagem Docker

O contexto é a raiz do monorepo, porque o build usa o `package-lock.json` e os
workspaces da raiz.

```bash
docker build -f apps/web/Dockerfile \
  --build-arg PUBLIC_API_URL=https://api.exemplo.org \
  -t idearium-web .

docker run --rm -p 4321:4321 idearium-web
```

A imagem usa `node:22-alpine` em estágios (deps, build, deps de produção,
runner), roda como o usuário `node` (não-root) e inicia com
`node apps/web/dist/server/entry.mjs`.

## Cache

As páginas públicas são SSR com `Cache-Control` público e curto quando a
requisição não traz sessão. Páginas com sessão nunca vão para cache
compartilhado. Atrás de CDN ou proxy reverso, o cache precisa respeitar
`s-maxage` e `Vary`, e não deve guardar respostas que tenham `Set-Cookie`.
Como o conteúdo não é gerado no build, mudar um RFC não exige novo deploy: a
página nova aparece quando o cache expira.

## Fontes

Uma família só: Inter (OFL), do pacote `@fontsource-variable/inter`, só com os
subsets latin e latin-ext. Declarada em `src/styles/global.css`; o app não faz
nenhum request a terceiros para fontes.

## Diagramas

Quatro diagramas, todos lidos do código. Os nomes entre crases são funções e
arquivos de `src/`.

### Caminho de uma requisição

Toda requisição passa por `middleware.ts`, que tira o prefixo `/en`, abre o
contexto da requisição e resolve a sessão uma única vez. A última decisão é do
`cachePublico`: só página de visitante anônimo, sem cookie de sessão e sem
falha da API vai para cache compartilhado.

```mermaid
flowchart TD
  A["GET /en/labs"] --> B["separarIdioma<br/>lang = en, caminho = /labs"]
  B --> C["locals.lang e locals.idiomaPreferido = null"]
  C --> D["dentroDaRequisicao(lang)<br/>contexto por requisição:<br/>x-lang nas chamadas à API, apiFalhou"]
  D --> E["usuarioAtual: GET /auth/me<br/>com id_acesso"]
  E -->|"401 ou sem id_acesso"| F["renovar: POST /auth/refresh<br/>grava par novo de cookies"]
  F --> G["GET /auth/me de novo"]
  E -->|"200"| H["locals.usuario"]
  G --> H
  E -->|"API fora (fetch lança)"| I["locals.usuario = null<br/>segue como anônimo<br/>cookies intactos"]
  F -->|"refresh recusado"| J["limpa cookies<br/>anônimo"]
  H --> K{"logado, lang pt-BR,<br/>GET, fora de /api/,<br/>sem cookie idioma_sugestao?"}
  K -->|"sim"| L["GET /users/me<br/>idiomaPreferido"]
  K -->|"não"| M{"lang = pt-BR?"}
  L --> M
  I --> M
  J --> M
  M -->|"sim"| N["next()"]
  M -->|"não, en"| O["next(URL sem /en)<br/>mantém locals e cookies"]
  N --> P["página SSR"]
  O --> P
  P --> Q["cachePublico(Astro)"]
  Q --> R{"GET e sem usuário e<br/>sem cookie id_acesso ou id_renova<br/>e API não falhou?"}
  R -->|"sim"| S["public, s-maxage=60,<br/>stale-while-revalidate=600"]
  R -->|"não"| T["private, no-store"]

  classDef roxo fill:#EDE4FB,stroke:#6D28D9,color:#2E1065,stroke-width:2px
  classDef azul fill:#DBEAFE,stroke:#1D4ED8,color:#172554,stroke-width:2px
  classDef decisao fill:#FFFFFF,stroke:#6D28D9,color:#2E1065,stroke-width:2px
  class A,B,C,D,N,O,P roxo
  class E,F,G,H,I,J,L azul
  class K,M,R decisao
  class Q,S,T roxo
```

### Sessão

Os dois tokens ficam em cookies `httpOnly`; a página nunca os vê. O access token
expira em 14 minutos no cookie (15 na API) e o refresh em 30 dias. Em qualquer
401, `comSessao` renova uma vez e repete a chamada, e o refresh antigo morre a
cada rotação. No logout, os cookies são limpos mesmo que a revogação falhe.

```mermaid
sequenceDiagram
  autonumber
  participant N as Navegador
  participant W as Web (Astro)
  participant A as API

  rect rgb(237, 228, 251)
  Note over N,A: Login por senha
  N->>W: POST /entrar (email, senha)
  W->>A: POST /auth/login
  A-->>W: accessToken, refreshToken, user
  W-->>N: Set-Cookie id_acesso (httpOnly, lax, 14 min)<br/>Set-Cookie id_renova (httpOnly, lax, 30 dias)<br/>secure só fora de dev
  end

  rect rgb(219, 234, 254)
  Note over N,A: Chamada autenticada com renovação
  N->>W: requisição com cookies
  W->>A: comSessao: Bearer id_acesso
  A-->>W: 401
  W->>A: POST /auth/refresh com id_renova
  A-->>W: par novo, o refresh antigo é revogado
  W-->>N: Set-Cookie com o par novo
  W->>A: repete a chamada com o token novo
  A-->>W: resposta
  end

  rect rgb(237, 228, 251)
  Note over N,A: Logout
  N->>W: /sair
  W->>A: POST /auth/logout com id_renova
  A-->>W: ok ou falha
  W-->>N: apaga id_acesso e id_renova<br/>(mesmo se a revogação falhou)
  end
```

### OAuth proposto

Contrato proposto: o backend da Etapa 6 ainda não existe, e todo este fluxo
está atrás da flag `PUBLIC_OAUTH=1` (sem ela, as rotas respondem 404). O
`state` nasce na web, vai e volta pela API, e é conferido contra o cookie
`id_oauth` (httpOnly, 10 minutos, uso único). Os tokens nunca passam pelo
endereço.

```mermaid
sequenceDiagram
  autonumber
  participant N as Navegador
  participant W as Web (Astro)
  participant A as API (proposta)
  participant P as Provedor (GitHub ou Google)

  Note over N,P: Contrato proposto. Backend da Etapa 6 ainda não existe. Atrás de PUBLIC_OAUTH.
  N->>W: GET /entrar/provedor
  W-->>N: Set-Cookie id_oauth (state, modo, voltar, lang)<br/>302 para a API
  N->>A: GET /auth/provedor?redirect=WEB/entrar/callback&state=...
  A-->>N: 302 para a tela do provedor
  N->>P: autoriza
  P-->>N: 302 para o callback da API
  N->>A: callback do provedor
  A-->>N: 302 WEB/entrar/callback?code=...&state=...
  N->>W: GET /entrar/callback?code&state
  Note over W: consumirEstado apaga id_oauth<br/>estadoConfere compara state (timingSafeEqual)
  W->>A: POST /auth/oauth/exchange { code }
  A-->>W: accessToken, refreshToken (login)<br/>ou { linked } (vínculo)
  W-->>N: gravarSessao e 302 para voltar<br/>(vínculo: /perfil?conta=conectada)
```

### Mapa de rotas por área

Cada grupo de páginas com os endpoints da API que consome. Leitura pública usa
`lib/api.ts` (sem token; a página da RFC lê com `comSessao` quando há sessão, por
causa dos rascunhos); escrita e dados da pessoa usam `comSessao`. Os grupos
tracejados só existem com a flag ligada. Institucional é conteúdo estático, sem
chamada à API.

```mermaid
flowchart LR
  subgraph pub["Leitura pública (cachePublico)"]
    direction TB
    p1["/ e /labs, /labs/slug"] --> e1["GET /labs, /labs/slug"]
    p2["/rfcs, /rfcs/slug"] --> e2["GET /rfcs, /rfcs/slug<br/>/rfcs/id/versions, enrollments,<br/>comments, tags"]
    p3["/tags, /tags/slug"] --> e3["GET /tags, /tags/slug"]
    p4["/buscar"] --> e4["GET /search, /tags"]
    p5["/builders, /users/username"] --> e5["GET /builders, /users/username,<br/>/users/username/rfcs, enrollments"]
  end

  subgraph aut["Autoria (sessão)"]
    direction TB
    a1["/rfcs/nova"] --> f1["POST /rfcs, /rfcs/id/tags"]
    a2["/rfcs/slug/editar"] --> f2["PATCH /rfcs/id, POST /rfcs/id/publish,<br/>archive, tags"]
    a3["/rfcs/slug/versoes"] --> f3["GET /rfcs/id/versions"]
    a4["POST /api/previa"] --> f4["sem API: renderizarMarkdown<br/>no servidor, exige sessão"]
  end

  subgraph par["Participação (sessão, na página da RFC)"]
    direction TB
    c1["/rfcs/slug"] --> g1["POST e DELETE /rfcs/id/enroll<br/>POST /rfcs/id/comments<br/>PATCH e DELETE /comments/id"]
  end

  subgraph con["Conta"]
    direction TB
    k1["/entrar, /criar-conta, /sair"] --> h1["POST /auth/login, /auth/register,<br/>/auth/logout"]
    k2["/perfil"] --> h2["GET e PATCH /users/me<br/>PATCH /builders/me"]
  end

  subgraph ins["Institucional (estático)"]
    direction TB
    i1["/sobre, /governanca, /transparencia,<br/>/codigo-de-conduta, 404"]
  end

  subgraph not["Notificações (PUBLIC_NOTIFICACOES=1)"]
    direction TB
    n1["/notificacoes"] --> j1["GET /notifications<br/>PATCH /notifications/id/read,<br/>/notifications/read-all"]
    n2["GET /api/notificacoes/contagem<br/>(polling da nav, 60 s)"] --> j2["GET /notifications (meta.unread)"]
  end

  subgraph oa["Auth da Etapa 6 (PUBLIC_OAUTH=1, contrato proposto)"]
    direction TB
    o1["/entrar/provedor,<br/>/entrar/callback"] --> l1["GET /auth/provedor<br/>POST /auth/oauth/exchange<br/>POST e DELETE /users/me/link-provedor"]
    o2["/recuperar-senha, /redefinir-senha,<br/>/verificar-email/token"] --> l2["POST /auth/forgot-password,<br/>/auth/reset-password,<br/>/auth/verify-email/token"]
  end

  classDef roxo fill:#EDE4FB,stroke:#6D28D9,color:#2E1065,stroke-width:2px
  classDef azul fill:#DBEAFE,stroke:#1D4ED8,color:#172554,stroke-width:2px
  classDef flag fill:#FFFFFF,stroke:#6D28D9,color:#2E1065,stroke-width:2px,stroke-dasharray:5 3
  class p1,p2,p3,p4,p5,a1,a2,a3,a4,c1,k1,k2,i1,n1,n2,o1,o2 roxo
  class e1,e2,e3,e4,e5,f1,f2,f3,f4,g1,h1,h2,j1,j2,l1,l2 azul
  style not stroke-dasharray:5 3
  style oa stroke-dasharray:5 3
```
