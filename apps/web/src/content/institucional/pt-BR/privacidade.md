---
titulo: "Política de privacidade"
descricao: "Quais dados o Idearium guarda, para quê, por quanto tempo e como você exerce os seus direitos."
rascunho: false
atualizado: 2026-10-10
---

*Versão de 10 de outubro de 2026. Este texto descreve o que o código faz hoje e é revisto a cada mudança.*

## Quem responde pelos dados

O Idearium é mantido por uma equipe voluntária. O controlador dos dados e o encarregado pelo tratamento (DPO), com os dados de contato que a LGPD pede, serão publicados aqui antes do lançamento. Até lá, qualquer pedido sobre dados vai para [mantenedores@idearium.example](mailto:mantenedores@idearium.example).

## O que pedimos

Para criar uma conta, só três coisas: email, nome de usuário (`@username`) e senha. Não pedimos documento nem telefone, e nenhuma rede externa é obrigatória. Nome completo, bio, foto, perfil de mão e idioma preferido são opcionais e só aparecem se você preencher.

Se você entrar com GitHub ou Google, usamos esse login só para entrar. Nome e foto de lá não vêm para cá.

## Para que usamos

- **Email:** entrar, recuperar a senha, confirmar o email e avisos da própria conta.
- **Senha:** guardamos apenas um hash, nunca a senha em si.
- **Perfil opcional:** mostrar o que você escolheu mostrar.
- **O que você publica:** exibir ideias, versões, comentários e inscrições.

Não vendemos dados, não os cedemos para publicidade e não usamos ferramentas de análise de terceiros.

## Pseudônimo

O `@username` é a única identidade exibida no site. Email e senha nunca aparecem. Escolha um nome que você aceite ver ligado ao que escreve.

## Cookies

Usamos quatro, todos para o site funcionar, nenhum para rastrear:

- `id_acesso`: prova que a sessão é sua. `httpOnly` (JavaScript não lê) e dura poucos minutos.
- `id_renova`: renova o acesso sem pedir a senha de novo. `httpOnly`, dura até 30 dias e é revogado no servidor quando você sai.
- `idioma_sugestao`: lembra que você dispensou o convite para ler em outro idioma. Dura um ano.
- `id_oauth`: só existe durante a entrada com GitHub ou Google, para proteger a volta do login. Dura alguns minutos.

Não usamos cookies de publicidade. A fonte Inter é servida pelo nosso servidor, então o seu IP não vai ao Google Fonts.

## O que fica público

RFCs, versões, comentários e inscrições (inclusive a saída) são públicos por desenho e publicados em CC BY-SA 4.0. Não escreva ali o que você não quer ver público. Os detalhes da licença estão nos [termos de uso](/termos).

## Por quanto tempo guardamos

Os dados da conta ficam enquanto a conta existir. Quando você exclui a conta, os dados pessoais saem. O conteúdo que você publicou permanece no histórico, anonimizado como “[conta removida]”. Prazos de retenção de logs e de backups serão publicados aqui antes do lançamento.

## Seus direitos

Pela LGPD (art. 18) você pode:

- confirmar que tratamos dados seus e acessá-los;
- corrigir dados incompletos ou errados;
- pedir portabilidade: no perfil, na seção “seus dados”, há o botão para baixar tudo em JSON;
- pedir a eliminação dos dados pessoais: em `/excluir-conta`;
- pedir informação sobre com quem compartilhamos dados (hoje, com ninguém além de quem hospeda o serviço);
- revogar consentimentos e reclamar à Autoridade Nacional de Proteção de Dados (ANPD).

Se algum desses botões ainda não estiver disponível, ou se você preferir, escreva para [mantenedores@idearium.example](mailto:mantenedores@idearium.example). Respondemos nos prazos da lei.

## Mudanças

Mudanças neste texto passam por proposta pública, como o resto do projeto. A data no topo diz qual versão está valendo.
