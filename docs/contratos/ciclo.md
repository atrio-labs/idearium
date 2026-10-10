# Contrato proposto: fechar o ciclo da ideia (C1)

Status: PROPOSTA. O frontend já implementa contra isto, atrás da flag
`PUBLIC_CICLO=1` (desligada por padrão). Nada aqui existe na API ainda.
Quando a API devolve 404 ou 405 nestes endpoints, a tela diz "a API ainda
não oferece esta ação" e não quebra.

Convenções: JWT Bearer como no resto da API; erros no formato padrão
`{ statusCode, message }`; datas ISO 8601; `:id` é o id da RFC.

Por que o front precisa (VISAO §6): o ciclo da RFC hoje termina em
"em construção". Falta dizer que a ideia virou algo, poder voltar atrás
num arquivamento (VISAO: arquivar é reversível), contar o progresso sem
misturar com a discussão e explicar cada edição.

## 1. Virou projeto

`POST /rfcs/:id/ship`

- Auth: obrigatória. Quem escreveu a RFC. Proposta de extensão: também
  quem tem inscrição ativa de BUILDER (o front só mostra a ação a quem
  escreveu; abrir para quem constrói é decisão do backend).
- Request: `{ "projectUrl": string, "projectSummary": string }`
  - `projectUrl`: http ou https, até 500 caracteres.
  - `projectSummary`: 5 a 280 caracteres, "o que ficou pronto".
- Response 200: a RFC completa, com `status: "PUBLISHED"` e os campos novos
  `projectUrl`, `projectSummary`, `shippedAt` (o front lê só os dois primeiros).
- Erros: 400 validação (URL de outro esquema, tamanhos); 401; 403 sem
  permissão; 404; 409 se o status não for IN_DISCUSSION nem IN_BUILDING.
- Regras: a RFC passa a PUBLISHED (o enum já existe). `GET /rfcs/:id` e a
  listagem devolvem `projectUrl` e `projectSummary` quando PUBLISHED, e
  `null` nos demais estados. A API valida o esquema da URL; o front também
  não confia e só renderiza http(s), com `rel="nofollow ugc noopener"`.
  Dispara a notificação `rfc_status_changed` já prevista. Não é reversível
  por esta rota; o caminho de volta é arquivar e trazer de volta.

## 2. Trazer de volta (desarquivar)

`POST /rfcs/:id/unarchive`

- Auth: quem escreveu a RFC.
- Request: sem corpo.
- Response 200: a RFC completa, com `archivedAt: null`.
- Erros: 401; 403; 404; 409 se a RFC não estiver ARCHIVED.
- Regras: o status volta ao que `recomputeRfcStatus` calcularia agora:
  IN_BUILDING se houver inscrição ativa de BUILDER, senão IN_DISCUSSION.
  Se a RFC tiver `projectUrl` (foi arquivada depois de PUBLISHED), volta a
  PUBLISHED. Se nunca teve número (rascunho arquivado), volta a DRAFT.
  Comentários, versões, inscrições e atualizações ficam como estavam.

## 3. Atualizações de progresso (RfcUpdate)

Recurso novo, ligado à RFC. Modelo:

```
RfcUpdate { id, rfcId, authorId, body (markdown), createdAt, updatedAt, deletedAt }
```

`GET /rfcs/:id/updates`

- Auth: opcional; mesma visibilidade da RFC (rascunho só para quem escreveu).
- Response 200: `RfcUpdate[]` em ordem crescente de `createdAt`, cada item
  com `author: { id, username, ... }` no mesmo formato de `Comentario`.
  Sem paginação na primeira versão (uso esperado: dezenas, não milhares).
  Se crescer, paginar no padrão `{ data, meta }` dos comentários.
- Erros: 404 RFC inexistente.

`POST /rfcs/:id/updates`

- Auth: obrigatória. Quem escreveu a RFC ou tem inscrição ativa (BUILDER).
- Request: `{ "body": string }`, 5 a 4000 caracteres, markdown.
- Response 201: o `RfcUpdate` criado, com `author`.
- Erros: 400 tamanho; 401; 403 sem inscrição e sem autoria; 404; 409 se a
  RFC não estiver IN_BUILDING.
- Regras: o `body` é guardado cru; o front renderiza com o mesmo renderer
  seguro do corpo da RFC. Dispara notificação a quem está inscrito e a quem
  escreveu, como os comentários. Pode virar `new_update` em `TipoNotificacao`.

Sugestão para depois (o front não usa): `PATCH /rfc-updates/:id` e
`DELETE /rfc-updates/:id` para a própria autoria, com a mesma lógica de
`isEdited` e `isDeleted` dos comentários.

## 4. Nota de mudança ao editar

`PATCH /rfcs/:id` (já existe) ganha o campo opcional `changeNote`.

- Request: acrescenta `"changeNote"?: string`, até 280 caracteres.
- Regra: só é gravada quando o corpo mudou e uma nova `RfcVersion` nasce;
  fica em `RfcVersion.changeNote` (coluna nova, `text`, nula). Se o corpo não
  mudou, o campo é ignorado.
- `GET /rfcs/:id/versions` passa a devolver `changeNote: string | null` em
  cada versão.
- Erro: 400 se passar de 280 caracteres.
- Compatibilidade: o front só envia `changeNote` quando a flag está ligada,
  o corpo mudou e a nota não está vazia. Se a API ainda recusar o campo com
  400 (validação com whitelist), o front repete o PATCH sem a nota, salva o
  texto e avisa que a nota não foi guardada.

## Resumo das mudanças de schema

- `Rfc`: `projectUrl text null`, `projectSummary text null`, `shippedAt timestamptz null`.
- `RfcVersion`: `changeNote text null`.
- Tabela nova `RfcUpdate` (campos acima).
