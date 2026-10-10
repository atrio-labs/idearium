# Contrato proposto: conta, LGPD e exclusão (frente C3)

Status: **proposta do frontend**. A API ainda não tem nenhum destes endpoints. O web chama todos atrás da flag `PUBLIC_CONTA=1` (desligada por padrão). Resposta 404 ou 405 é tratada como "ainda não disponível", sem erro para a pessoa.

Todos exigem `Authorization: Bearer <access>` (o web lê do cookie httpOnly), exceto o item 3. Erros de validação seguem o padrão atual: `400` com `message` (string ou array) já traduzida pelo header `x-lang`.

Convenção nova: **senha atual errada devolve `403`**, não `401`. O web trata `401` como "access token expirado" e tenta renovar a sessão; um 401 por senha errada dispararia um refresh à toa.

## 1. Trocar a senha

`PATCH /users/me/password`

```json
{ "currentPassword": "string", "newPassword": "string (10 a 200 caracteres, mesma regra do cadastro)" }
```

- `204`, ou `200` com `{ accessToken, refreshToken }`. Efeito: **revoga todas as outras sessões** (refresh tokens) da pessoa. Se a API devolver um par novo, ele pertence à sessão atual e o web o grava nos cookies; se devolver `204`, a sessão atual precisa continuar valendo.
- `403` senha atual não confere. `400` senha nova inválida.
- Conta criada só por OAuth (sem senha): fora do escopo; o web esconde o formulário quando `/users/me` traz `hasPassword: false`.

## 2. Trocar o email

`POST /users/me/email`

```json
{ "newEmail": "string", "password": "string" }
```

- `204`. A API envia um link ao email **novo**; o email só muda quando o link é confirmado. O atual segue valendo até lá.
- `403` senha errada. `409` email já em uso (o web mostra "esse email não pode ser usado", sem confirmar se existe). `400` formato inválido.

`POST /auth/confirm-email/:token` (sem sessão, como `/auth/verify-email/:token`)

- `204`/`200` ok; `410` ou `code: TOKEN_EXPIRED` expirado; `400`/`404` ou `code: TOKEN_INVALID` inválido.
- O link no email aponta para `<SITE_URL>/confirmar-email/<token>` (rota do web).
- Ao confirmar, a API deve revogar as outras sessões (troca de credencial) e avisar o email antigo.

## 3. Sair de todos os aparelhos

`POST /auth/logout-all` (sem corpo)

- `204`. Revoga **todos** os refresh tokens da pessoa, inclusive o da sessão atual. O web limpa os cookies e vai ao átrio com aviso.

## 4. Exportar os dados (LGPD art. 18, portabilidade)

`GET /users/me/export`

- `200` JSON com tudo que é da pessoa:

```json
{
  "exportedAt": "ISO-8601",
  "profile": { "username", "email", "fullName", "bio", "avatarUrl", "preferredLocale", "createdAt", "builderProfile": {} },
  "rfcs": [],
  "versions": [],
  "comments": [],
  "enrollments": [],
  "linkedProviders": ["github"]
}
```

- Sem hash de senha, sem tokens. Formato livre para o web: ele repassa o JSON sem interpretar.
- O web entrega como download em `GET /api/meus-dados` (rota SSR): chama a API com a sessão e responde com `Content-Disposition: attachment; filename="idearium-<username>-<data>.json"` e `Cache-Control: private, no-store`. O token nunca chega ao navegador.

## 5. Excluir a conta

`DELETE /users/me`

```json
{ "password": "string", "confirmUsername": "string (o @username, sem o @)" }
```

- `204`. Efeito esperado, coerente com o VISAO (histórico público não se deleta):
  - **saem**: email, hash de senha, nome completo, bio, avatar, builder profile, vínculos OAuth, todas as sessões, preferências;
  - **ficam, anonimizados**: RFCs, versões, comentários e inscrições, com o autor exibido como `[conta removida]`; o `@username` deixa de aparecer em qualquer resposta pública e não deve apontar para a pessoa;
  - o `@username` liberado ou reservado: decisão do backend (recomendado reservar, para não permitir personificação).
- `403` senha errada. `400` `confirmUsername` não confere. `409` a conta não pode ser excluída (ex.: única mantenedora de algo), com `message` explicando.
- Conta só com OAuth e sem senha: `password` pode ir omitido e a confirmação fica só no `confirmUsername`. Ponto aberto para o Kae; o web hoje sempre pede a senha.

## Pontos abertos

1. Se `PATCH /users/me/password` devolve tokens novos ou `204` (ver item 1).
2. Reserva do `@username` depois da exclusão.
3. Exclusão para conta sem senha (OAuth).
4. Prazo de retenção de logs e backups, que a política de privacidade promete publicar antes do lançamento.
5. Formato definitivo do JSON da exportação.
