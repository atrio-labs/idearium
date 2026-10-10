---
titulo: "Transparência"
descricao: "Como o Idearium se sustenta, o que ele não faz com dinheiro e o que fazemos com os seus dados."
rascunho: true
atualizado: 2026-10-10
---

<!-- fonte: VISAO §11 -->
## O dinheiro nunca vem de quem usa

O Idearium é gratuito para sempre. Gratuito quer dizer gratuito: não é freemium nem "gratuito com limitações". Não há plano premium e não há anúncios.

## Como o projeto se sustenta

O plano tem três fases.

**Lançamento (0 a 6 meses).** Nenhuma receita. A estimativa do VISAO para o custo total é de US$ 20 a 30 por mês (Postgres gerenciado, hospedagem do app, domínio e email transacional), pago do bolso de quem mantém.

**Apoiadores (6 a 12 meses).** Uma página pública de apoio, via OpenCollective ou Liberapay, com os custos abertos. A meta do VISAO é cobrir a infraestrutura com folga, com algumas dezenas de apoiadores individuais.

**Institucional (a partir de 12 meses).** Candidatura a grants pequenos: programas de apoio a código aberto, fundações lusófonas com agenda de civic tech e editais de extensão universitária.

Os valores acima são estimativas do VISAO, não resultados.

## Custos reais

O custo mensal real da infraestrutura será publicado aqui. **Status: a publicar.**

## O que nunca faremos

- Cobrar de quem usa.
- Ficar com percentual de transações.
- Vender dados ou anúncios.
- Criar plano premium.
- Aceitar patrocínio que comprometa a neutralidade editorial.

## Sem mediação financeira

A plataforma não toca dinheiro entre pessoas: sem taxa, sem divisão de receita, sem recompensa intermediada. Quem constrói aqui é voluntário. Quem quiser ser pago combina isso fora do Idearium.

## Privacidade e dados

*Esta seção é um rascunho a revisar pelos mantenedores. Descreve o que o código faz hoje e deve ser revista a cada mudança.*

**O que pedimos para criar uma conta.** Só três coisas: email, nome de usuário (`@username`) e senha. Não pedimos documento, telefone nem ligação obrigatória com redes externas. Nome completo e bio são opcionais, e só aparecem se você preencher.

**Pseudônimo por padrão.** O `@username` é o que aparece em toda parte.

**Senha.** Guardamos apenas um hash da senha, nunca a senha em si.

**Cookies.** Usamos três, todos para manter você conectado, e nenhum para rastrear:

- `id_acesso`: prova que a sessão é sua. Inacessível para JavaScript (`httpOnly`) e dura poucos minutos.
- `id_renova`: renova o acesso sem pedir a senha de novo. Também `httpOnly`, e dura até 30 dias. Ao sair, ele é revogado no servidor.
- `id_quem`: guarda só o seu `@username`, que já é público. Serve para o menu mostrar que você está conectada ou conectado. Esse é legível por JavaScript, de propósito.

Não usamos cookies de publicidade nem ferramentas de análise de visitas.

**Fontes tipográficas.** A fonte Inter é servida pelo nosso próprio servidor. Nenhuma página pede nada ao Google Fonts, então o seu IP não vai para lá só porque você abriu o Idearium.

**Venda de dados.** Não vendemos dados. Esse é um dos princípios do projeto, e está nos anti-modelos acima.

**O que fica público.** RFCs, comentários, inscrições (inclusive a saída) e o histórico de versões são públicos por desenho, em CC BY-SA 4.0. Não escreva ali nada que não queira ver público.
