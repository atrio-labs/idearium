# Contrato proposto: traduções, acompanhar e menções

Frente C5 do frontend. Nada aqui existe ainda no backend, exceto o que está marcado como "já existe". O frontend segue este contrato atrás de flags desligadas por padrão; resposta 404 ou 405 vira "ainda não disponível" e nada quebra.

## 1. Traduções (flag `PUBLIC_TRADUCOES`)

Já existe: `POST /rfcs` aceita `translationOfId` e `locale`; `GET /rfcs/:slug` devolve `translationOfId` e `translationOf: { id, number, slug, locale, title }`. O frontend usa isso sem flag: mostra "tradução de RFC-XXXX" e a ação "traduzir esta ideia" (abre `/rfcs/nova?traducaoDe=<id>&original=<slug>`, com idioma oposto e lab herdado). O `original` existe porque `GET /rfcs/:slug` só lê por slug.

Proposta: `GET /rfcs/:slug` passa a devolver a lista de traduções publicadas:

```json
"translations": [
  { "id": "uuid", "number": 12, "slug": "...", "locale": "en", "title": "..." }
]
```

- Só RFCs que o leitor pode ver (publicadas; rascunho só para o autor).
- Ordenadas por `number`. Sem paginação (poucas por ideia).
- Sem `translations` na resposta, a seção não aparece.

## 2. Acompanhar (flag `PUBLIC_ACOMPANHAR`)

Acompanhar é receber avisos da ideia sem se inscrever para construir. Não há contador público nem lista pública de quem acompanha (VISAO §9, anti-vaidade): nenhuma resposta de leitura pública inclui contagem ou pessoas.

| Chamada | Resposta |
| --- | --- |
| `POST /rfcs/:id/follow` | 204 (ou 200). Idempotente. |
| `DELETE /rfcs/:id/follow` | 204. Idempotente. |
| `GET /rfcs/:id/follow` | 200 `{ "following": boolean }`, só para a própria pessoa (exige token). |
| `GET /me/follows?page=&limit=` | `{ data: RfcResumo[], meta }` no padrão paginado da API; só as RFCs visíveis. |

Efeito pedido ao backend de notificações: quem acompanha uma RFC recebe os mesmos eventos que o autor e quem constrói (`new_comment`, `rfc_status_changed`, nova versão), sem ser inscrito. O módulo de notificações deve considerar os follows ao gerar notificações.

Frontend: botão na coluna lateral da RFC (POST para `/rfcs/<slug>/acompanhar`, resposta 303, funciona sem JS) e seção "o que acompanho" no `/perfil`. Sem o `GET /rfcs/:id/follow` o botão não aparece.

## 3. Menções `@username` (sem flag)

Já funciona no frontend: em comentário, `@username` (3 a 30 caracteres: minúsculas, dígitos, `.`, `_`, `-`, o mesmo padrão da API) vira link para `/users/<username>`. Não vale para email, código em linha ou bloco, nem dentro de link.

Nota para o contrato de notificações (`lib/notificacoes.ts`, tipo `mention`): o backend deve extrair as menções do corpo do comentário com a mesma regra (`(^|[^\w.@/+-])@([a-z0-9._-]{3,30})`, sem o ponto final da frase), ignorar usernames que não existem e gerar `mention` com `payload.commentId` e `payload.actorUsername`. O frontend não envia lista de menções; a fonte é o texto.
