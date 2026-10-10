# Contrato proposto: moderação (frente C2)

Status: PROPOSTA. O front está pronto atrás de `PUBLIC_MODERACAO=1` (desligada por padrão) e fala só com os endpoints abaixo. Origem: ROADMAP_BACKEND, Etapa 7, e VISAO §10 #5 (moderação pós-publicação, sem fila de aprovação) e §13 (suspenso pode contestar). Pontos marcados com **PROPOSTA** vão além do que o roadmap já prevê.

Observações sobre o estado atual da API:

- O `schema.prisma` ainda não tem o model `Report` (o roadmap diz que existe; não existe). Precisa nascer junto.
- `GET /auth/me` devolve `role` (`USER` ou `MAINTAINER`). O front usa isso só para decidir o que mostrar; a API decide de verdade e responde 403.
- Convenções: paginação `{ data, meta: { page, limit, total, totalPages } }`, erros `{ message }`, mensagens no idioma de `x-lang`.

## Reportar

### POST /reports

- Auth: qualquer pessoa logada (Bearer).
- Request: `{ targetType: "RFC" | "COMMENT" | "USER", targetId: string, reason: "harassment" | "discrimination" | "personal_data" | "spam" | "illegal" | "other", details?: string (até 1000) }`. **PROPOSTA**: `details` e o enum de `reason`, que espelha as categorias do código de conduta.
- Response 201: `{ id, status: "OPEN", createdAt }`. Nada sobre o alvo.
- Erros: 400 validação; 401; 403 reportar o próprio conteúdo ou a própria conta; 404 alvo inexistente (ou RFC rascunho de outra pessoa); 409 a pessoa já tem reporte aberto para esse alvo; 429 limite (sugestão: 10 por hora por pessoa).
- Regras: o reportado nunca vê quem reportou. O reporte não altera o conteúdo.
- Por que o front precisa: o botão "reportar" e a página `/reportar`. Hoje o código de conduta manda escrever por email; sem este endpoint a flag fica desligada. O front trata 404/405 como "ainda não disponível" e 409/403/429 com mensagens próprias.

## Painel dos mantenedores

Todos exigem `role = MAINTAINER`; senão 403. Nenhum devolve estatística global.

### GET /admin/reports?status=&page=&limit=

- `status`: `OPEN` (padrão), `RESOLVED` ou `DISMISSED`. Mais antigos primeiro em `OPEN`.
- Response 200, cada item:

```json
{
  "id": "…", "targetType": "RFC|COMMENT|USER", "targetId": "…",
  "reason": "harassment", "details": "…", "status": "OPEN",
  "resolution": null, "createdAt": "…",
  "reporter": { "username": "…" },
  "target": {
    "rfcSlug": "…",
    "username": "…",
    "excerpt": "…",
    "hidden": false,
    "suspended": false
  }
}
```

  `rfcSlug` vale para RFC e para o comentário (a RFC dele); `username` para USER; `excerpt` é um trecho já cortado (título da ideia ou início do comentário); `hidden` indica RFC já oculta; `suspended` indica conta já suspensa.

- Por que o front precisa: montar a fila sem uma chamada extra por item. O front monta os links só de `rfcSlug`/`username`/`targetId`, nunca de URL vinda da API. `meta.total` com `status=OPEN` é o único número mostrado (tamanho da fila).
- **PROPOSTA**: `GET /admin/stats` não entra. Se houver estatística, só contagem operacional da fila, que `meta.total` já dá.

### PATCH /admin/reports/:id

- Request: `{ status: "RESOLVED" | "DISMISSED", resolution: string (1 a 1000, obrigatório) }`. **PROPOSTA**: `resolution` obrigatório; o front manda o motivo escrito pela pessoa.
- Response 200: o reporte atualizado. Erros: 403; 404; 409 já decidido.

### PATCH /admin/rfcs/:id/hide e /admin/rfcs/:id/unhide

- Request: `{ reason: string (1 a 1000, obrigatório) }`. **PROPOSTA**: `unhide` (reversível por regra do roadmap) e `reason` obrigatório.
- Response 200: `{ id, hiddenAt: string | null }`. Erros: 403; 404; 409 já no estado pedido.
- Regra: ocultar não apaga nada; delete não existe.

### PATCH /admin/users/:id/suspend e /admin/users/:id/unsuspend

- Request: `{ reason: string (1 a 1000, obrigatório) }`. **PROPOSTA**: `unsuspend` e `reason`.
- Response 200: `{ id, suspended: boolean }`. Erros: 403 (inclusive suspender a si mesmo ou outro mantenedor); 404; 409.
- Regra: suspenso não loga; RFCs e comentários ficam, anonimizados (ver abaixo); suspensão revoga os refresh tokens.

### Comentários (lacuna)

O roadmap não prevê ocultar comentário. O painel deixa o comentário só com resolver/descartar. **PROPOSTA** (opcional): `PATCH /admin/comments/:id/hide` e `/unhide`, no mesmo formato, e o front ganha a opção.

### Registro público de decisão (PROPOSTA, sem UI ainda)

Por transparência (VISAO §13), cada decisão de `hide`, `unhide`, `suspend`, `unsuspend` e `PATCH /admin/reports/:id` grava um registro `{ at, action, targetType, targetId, reason }`. Sugestão: `GET /moderation/log` público e paginado, sem identificar quem reportou e sem `details`. O front só liga uma página de registro depois que isso existir. Decisão de produto pendente: mostrar o motivo inteiro ou só a categoria.

## O que as leituras públicas passam a devolver (PROPOSTA)

- `GET /rfcs/:slug` e listas: `hiddenAt: string | null` na RFC. RFC oculta: para o autor e para mantenedores, a resposta é completa; para as demais pessoas, 200 com o objeto sem conteúdo útil (`body` e `summary` vazios) e `hiddenAt` preenchido, e a RFC some das listas, da busca e do feed. O front mostra "ocultada pela moderação" quando `hiddenAt` vem e a pessoa não é autora nem mantenedora.
- Autor suspenso (RFCs, comentários, inscrições, perfil): `author: { id, username: "[suspenso]", fullName: null, avatarUrl: null, suspended: true }`. O front trata `suspended: true` ou o username literal `[suspenso]`, mostra "[suspenso]" e não gera link pro perfil. `GET /users/:username` de conta suspensa: 404.
- Por que o front precisa: sem isso a UI não distingue ideia oculta de ideia inexistente, nem autor suspenso de autor comum.

## Apelação (PROPOSTA)

Hoje, sem backend: `/contestar` orienta a escrever para mantenedores@idearium.example, do email da conta. A página é pública, sem sessão, porque quem está suspenso não loga.

Evolução: `POST /appeals`, **sem auth** (quem está suspenso não tem sessão), com `{ email, username?, targetType?, targetId?, message }`. Response 202 sempre igual (não revela se o email existe). Erros 400 e 429. Mantenedores veem as apelações em `GET /admin/appeals` e respondem com `PATCH /admin/appeals/:id { status, resolution }`, e a resolução entra no registro público. Rate limit forte por IP e por email.

## Ordem sugerida no backend

1. Model `Report` + `POST /reports` + `GET`/`PATCH /admin/reports`.
2. `hide`/`unhide` e `suspend`/`unsuspend` com `reason`, mais `hiddenAt` e a anonimização nas leituras.
3. Registro de decisões; depois `POST /appeals`.
