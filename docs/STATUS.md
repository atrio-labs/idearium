# Idearium: status e pendências do backend

Atualizado em 10/10/2026 por Gabriele. Cópia editável no Claude: https://claude.ai/code/artifact/b5a57660-65c9-4d48-afff-e023fc3845eb

O frontend do Idearium está completo. O que falta para lançar agora é backend, infra e conteúdo. Tudo que depende da API nova já existe no web atrás de flags desligadas (`PUBLIC_*`), escrito contra contratos propostos em `docs/contratos/` e no `ROADMAP_FRONTEND.md`. Cada flag só é ligada quando o endpoint correspondente estiver no ar.

- **Pronto e ligado:** leitura, conta por senha, participação, autoria com histórico e diff, busca, i18n pt-BR e en, páginas institucionais, termos, privacidade, SEO e RSS.
- **Pronto atrás de flag:** 7 frentes que esperam endpoints novos (tabela abaixo).
- **Kae:** 7 blocos de backend, em ordem, mais hospedagem e contas externas.
- **Estado do código:** branch `development` do `atrio-labs/idearium`, com 159 testes unitários passando. O e2e Playwright está escrito e ainda não rodou.

## Status por área

O front cobre tudo da lista. As linhas "atrás de flag" ligam no dia em que o backend entregar o contrato da coluna Contrato.

| Área | Status | Flag | Contrato | O que falta |
| --- | --- | --- | --- | --- |
| Leitura pública, labs, tags, busca, perfis | Pronto | — | — | — |
| Conta por senha, sessão, perfil | Pronto | — | — | — |
| Autoria, publicar, arquivar, histórico e diff | Pronto | — | — | — |
| Inscrição e comentários (markdown e menções) | Pronto | — | — | — |
| Interface pt-BR e en (`/en`) | Pronto | — | — | Nomes de lab traduzidos na API; `preferredLocale` em `/auth/me` |
| Institucionais, termos e privacidade | Pronto | — | — | Controlador, DPO, foro e retenção antes do lançamento |
| SEO: sitemap, robots, Open Graph, RSS | Pronto | — | — | `SITE_URL` em produção |
| Notificações (Etapa 5) | Pronto atrás de flag | `PUBLIC_NOTIFICACOES` | `ROADMAP_FRONTEND.md` F6 | Módulo inteiro; o model não existe no schema |
| GitHub, Google, verificação e recuperação de senha (Etapa 6) | Pronto atrás de flag | `PUBLIC_OAUTH` | `ROADMAP_FRONTEND.md` "Contratos propostos ao backend" | Módulo inteiro, apps OAuth, Resend |
| Moderação (Etapa 7) | Pronto atrás de flag | `PUBLIC_MODERACAO` | `docs/contratos/moderacao.md` | Módulo inteiro; o model `Report` não existe no schema |
| Ciclo da ideia: virou projeto, desarquivar, progresso, nota de mudança | Pronto atrás de flag | `PUBLIC_CICLO` | `docs/contratos/ciclo.md` | Endpoints e campos novos |
| Segurança da conta e LGPD: senha, email, sair de tudo, exportar, excluir | Pronto atrás de flag | `PUBLIC_CONTA` | `docs/contratos/conta.md` | Endpoints novos |
| Lista de traduções de uma RFC | Pronto atrás de flag | `PUBLIC_TRADUCOES` | `docs/contratos/ideia.md` | `translations` no `GET /rfcs/:slug` |
| Acompanhar uma ideia | Pronto atrás de flag | `PUBLIC_ACOMPANHAR` | `docs/contratos/ideia.md` | Recurso `follow` |
| Hardening, RSS e API pública (Etapa 8) | Falta backend | — | `ROADMAP_BACKEND.md` Etapa 8 | Rate limit, Helmet/CSP, OpenAPI. O RSS já sai pelo web |
| Hospedagem, domínio, backup, status | Falta infra/conteúdo | — | — | Ver seção de infra |
| RFCs semente e lançamento fechado | Falta infra/conteúdo | — | — | Ver seção de infra |

## O que o Kae precisa fazer no backend

São 7 blocos, em ordem de prioridade. Os 4 primeiros bloqueiam o lançamento. Cada bloco destrava uma flag do web, que já está pronto para consumir o contrato descrito.

1. **Notificações (Etapa 5)**, que liga `PUBLIC_NOTIFICACOES`
   - [ ] Criar o model `Notification`: o roadmap diz que ele já existe, mas ele não está no `schema.prisma`
   - [ ] `GET /notifications` paginado em `{data, meta}`, com `meta.unread`
   - [ ] `PATCH /notifications/:id/read` e `PATCH /notifications/read-all`
   - [ ] Eventos `new_enrollment`, `new_comment`, `rfc_status_changed` e `mention`, com `payload` contendo `rfcSlug`, `rfcNumber`, `rfcTitle`, `actorUsername`, `commentId` e `status`
   - [ ] Considerar quem acompanha a ideia (bloco 6) e extrair menções `@username` com a mesma regra de username da API
2. **Login social e email (Etapa 6)**, que liga `PUBLIC_OAUTH`
   - [ ] `GET /auth/github` e `GET /auth/google` recebem `redirect` e `state`; validar `redirect` contra uma lista de origens
   - [ ] O callback redireciona ao web com um `code` de uso único (\~60 s); `POST /auth/oauth/exchange {code}` devolve os tokens
   - [ ] Erros com `code`: `ACCOUNT_EXISTS`, `PROVIDER_IN_USE`, `CODE_EXPIRED`, `TOKEN_EXPIRED`, `TOKEN_INVALID`, `LAST_LOGIN_METHOD`
   - [ ] `forgot-password`, `reset-password`, `verify-email/:token` e `resend-verification`, com envio pelo Resend
   - [ ] Vincular e desvincular provedores; `GET /users/me` passa a trazer `emailVerified`, `hasPassword` e `linkedProviders`
3. **Segurança da conta e LGPD**, que liga `PUBLIC_CONTA`
   - [ ] `PATCH /users/me/password` (revoga as outras sessões)
   - [ ] `POST /users/me/email` e `POST /auth/confirm-email/:token`
   - [ ] `POST /auth/logout-all`
   - [ ] `GET /users/me/export` (JSON com perfil, RFCs, versões, comentários e inscrições)
   - [ ] `DELETE /users/me`: remove os dados pessoais e anonimiza o conteúdo como "\[conta removida\]"
   - [ ] Senha errada responde 403, não 401, porque o web trata 401 como token vencido
4. **Moderação (Etapa 7)**, que liga `PUBLIC_MODERACAO`
   - [ ] Criar o model `Report`: o roadmap diz que existe, mas ele não está no schema
   - [ ] `POST /reports` com `reason` (enum do código de conduta) e `details`; responde 409 para reporte duplicado e 403 para o próprio conteúdo
   - [ ] `GET /admin/reports` e `PATCH /admin/reports/:id`, com `resolution` obrigatória
   - [ ] Ocultar e reexibir RFC; suspender e reativar usuário; `reason` obrigatório em todos
   - [ ] Leituras públicas devolvem `hiddenAt` e `author.suspended`
   - [ ] Opcional: `POST /appeals` e `GET /moderation/log`
5. **Ciclo da ideia**, que liga `PUBLIC_CICLO`
   - [ ] `POST /rfcs/:id/ship {projectUrl, projectSummary}`, que leva a RFC a `PUBLISHED`
   - [ ] `POST /rfcs/:id/unarchive`
   - [ ] Recurso `RfcUpdate`: `GET` e `POST /rfcs/:id/updates`
   - [ ] `changeNote` no `PATCH /rfcs/:id`, gravado em `RfcVersion` e devolvido em `/versions`
6. **Traduções e acompanhar**, que ligam `PUBLIC_TRADUCOES` e `PUBLIC_ACOMPANHAR`
   - [ ] `translations` na resposta de `GET /rfcs/:slug`
   - [ ] `POST`, `DELETE` e `GET /rfcs/:id/follow`; `GET /me/follows`. Sem contagem pública de quem acompanha
7. **Hardening e ajustes (Etapa 8)**
   - [ ] Rate limit em login, cadastro e comentários; Helmet e CSP; limite de payload
   - [ ] OpenAPI publicado e health check real (banco e email)
   - [ ] `preferredLocale` em `/auth/me`, para tirar a chamada extra a `/users/me` que o web faz hoje
   - [ ] Nome dos labs em inglês na API (hoje fica num dicionário do web)
   - [ ] `apps/api/Dockerfile` de `node:20` para `node:22`, como o resto do projeto

## Contratos propostos pelo frontend

Os contratos são propostas e o Kae pode mudar formato e nomes. Se mudar, o front se ajusta antes de ligar a flag. O texto completo, com request, response, erros e regras, está no repositório.

| Contrato | Arquivo | Pontos a decidir |
| --- | --- | --- |
| Notificações | `ROADMAP_FRONTEND.md`, seção F6 | `meta.unread` ou um `GET /notifications/unread-count` leve; se abrir a RFC marca como lida |
| OAuth e email | `ROADMAP_FRONTEND.md`, "Contratos propostos ao backend" | Um scanner de email pode gastar o token de verificação ao abrir o link |
| Conta e LGPD | `docs/contratos/conta.md` | Troca de senha devolve 204 ou tokens novos; reservar o `@username` após a exclusão; conta só com OAuth na exclusão |
| Moderação | `docs/contratos/moderacao.md` | Registro público de decisões mostra o motivo inteiro ou só a categoria; ocultar comentário |
| Ciclo da ideia | `docs/contratos/ciclo.md` | Quem constrói também pode marcar "virou projeto"; editar e remover atualização |
| Traduções e acompanhar | `docs/contratos/ideia.md` | Quais eventos notificam quem acompanha |

Duas convenções valem para todos os contratos:

- Endpoint que ainda não existe deve responder 404 ou 405. Com isso o web mostra "ainda não disponível" e não quebra.
- O web manda o idioma no header `x-lang`. Mensagens de erro de negócio devem voltar traduzidas, como já acontece com as de validação.

## Infra, contas externas e conteúdo

Nada disto é código. Sem estes itens não há lançamento, mesmo com as etapas 5 a 7 do backend prontas.

| Item | Quem | Situação | Observação |
| --- | --- | --- | --- |
| Hospedagem do web e da API | Kae | não começou | Para testar de graça: Render (web e API) + Neon (Postgres). O web já tem `apps/web/Dockerfile`; a API usa `node:20-alpine` e o resto usa Node 22 |
| Postgres gerenciado com backup automático | Kae | não começou | Neon Free não expira; o Postgres grátis do Render apaga em 30 dias |
| Domínio e HTTPS | Kae | não começou | `idearium.community` está citado no roadmap; o cookie de sessão exige HTTPS em produção |
| Variáveis de produção | Kae | não começou | `PUBLIC_API_URL` (build), `SITE_URL`, `HOST`, `PORT` e as flags `PUBLIC_*` (ver `apps/web/README.md`) |
| Apps OAuth no GitHub e no Google | Kae | não começou | Callback na API; a API valida `redirect` contra lista de origens |
| Conta no Resend | Kae | não começou | Email de verificação, recuperação de senha e troca de email |
| Sentry (web e API) | Kae | não começou | Pendente desde a Etapa 0 |
| Página de status | Kae | não começou | UptimeRobot ou Cronitor no plano grátis |
| Email real dos mantenedores | Gabriele e Kae | provisório | Hoje é `mantenedores@idearium.example`, citado na conduta, na transparência e na privacidade |
| Custo mensal real | Gabriele e Kae | a publicar | A transparência mostra só a estimativa do VISAO |
| 10 a 20 RFCs semente, ao menos uma por lab | Gabriele e Kae | não começou | O banco local tem só dados de teste |
| Lançamento fechado para \~20 pessoas | Gabriele e Kae | depois de tudo acima | Etapa 9: uma semana de retorno antes do soft launch |

## Fora de escopo e decisões já tomadas

O VISAO §9 recusa estes itens de propósito. Pedido que caia aqui é recusado, não priorizado.

- Curtidas, ranking, "ideias em alta", badges, pontos
- Seguir pessoas, contagem de seguidores ou de visualizações
- Mensagem privada entre usuários
- Notificação de engajamento ("alguém viu seu perfil")
- Plano pago, taxa ou intermediação de dinheiro

Decisões de 10/10/2026 que valem para o backend:

- **Renderização:** todas as páginas do web são SSR com cache HTTP curto (`s-maxage=60`) para quem não tem sessão. Não há rebuild quando o conteúdo muda.
- **Idioma:** interface em pt-BR e en com prefixo `/en`. O web manda o idioma à API pelo header `x-lang`.
- **Login social:** só GitHub e Google, sem Apple.
- **Identidade visual:** direção minimalista (VISAO §12). O laboratório não tem mais cor, só nome e glyph.
