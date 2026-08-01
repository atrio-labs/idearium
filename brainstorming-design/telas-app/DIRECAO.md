# Telas de aplicação — direção

> Continuação de `atrio-v2/`. Lá a pergunta era como o átrio se parece.
> Aqui é como as telas de **ação** se comportam: entrar, escrever, editar,
> se inscrever, comentar, buscar.

## O problema

O átrio tem um achado que sustenta a tela inteira: **o dado da RFC é a imagem**.
A trilha tem o dela: **barrinha é passo dado, não porcentagem**. A errata tem a
sua: **nada é apagado**.

As telas de ação não tinham nada equivalente. Um formulário de login com dois
campos dentro de um cartão branco é correto e é o que qualquer produto tem.
Coeso no CSS, sem alma. O risco não é feiúra: é a metáfora meio-aplicada, o
mesmo diagnóstico que matou o Kare OS.

## O eixo

> **A tela mostra a consequência do ato, enquanto o ato acontece.**

Não é preview no sentido de "veja antes de enviar". É o objeto que você está
fabricando se montando à sua frente, com o material real do sistema.

Três razões pra isso e não outra coisa:

1. **Continua o achado do átrio.** Lá o dado vira imagem; aqui o ato vira
   objeto. É a mesma tese — a interface mostra a matéria, não fala sobre ela.
2. **Resolve o problema pedagógico do produto.** Quem chega não sabe o que é
   RFC, lab, inscrição ou rascunho. O `VISAO.md` §7 diz que a Luísa não
   programa. Ver o cartão nascendo ensina o que é uma RFC sem uma linha de
   texto explicativo.
3. **Não é enfeite, é informação.** Cada preview mostra um estado real que a
   pessoa precisaria descobrir depois, errando.

## Achado por tela

| tela | o ato | o que a tela mostra acontecendo |
|---|---|---|
| **entrar** | abrir sessão | as três coisas que a sessão destrava, nos chips do ciclo. Quem veio de `?voltar=` vê a ideia específica que o trouxe |
| **criar conta** | escolher pseudônimo | o `@username` sendo fabricado: vira assinatura de comentário, inicial no círculo colorido, linha na lista de mãos |
| **escrever ideia** | fabricar uma RFC | o cartão do átrio se montando ao lado, com o dither rodando na semente da própria RFC e o chip travado em `rascunho` |
| **editar** | mudar o corpo | a errata que vai nascer: o trecho riscado e a correção ao lado, no mesmo componente do átrio |
| **publicar** | atribuir número | o cartão perdendo o chip `rascunho` e ganhando o número permanente. Irreversível, e a tela diz isso mostrando |
| **inscrever-se** | entrar numa ideia | seu círculo entrando na fila de quem constrói, e o chip da RFC fazendo o swap de `em discussão` para `em construção` |
| **sair de uma ideia** | sair em público | seu círculo migrando para "passaram por aqui" em vez de sumir |
| **comentar** | entrar na discussão | o comentário tomando a forma que vai ter na thread, com sua inicial e seu `@` |
| **perfil** | ficar encontrável | o cartão de builder exatamente como aparece em `/builders` |
| **buscar** | consultar | como a consulta foi interpretada — a busca é FTS por idioma e sensível a acento, então mostrar isso é honestidade, não detalhe técnico |

## Regras de execução

**O preview usa material real, nunca mock.** O canvas da `Materia.astro` roda
com a semente da RFC de verdade. O cartão é o `CartaoIdeia.astro`, não uma
cópia parecida. Se o preview divergir do resultado, ele mente e é pior que não
existir.

**O preview é secundário na hierarquia.** O formulário é o que a pessoa opera;
o preview acompanha. Em telas de duas colunas, o preview é a coluna estreita e
não rouba o foco. Em tela estreita ele vai para baixo do formulário, nunca some
— num celular ele continua sendo a explicação.

**Atualiza em tempo real, sem salvar.** JS de página, sem framework: `input` →
atualiza o nó. As animações continuam nomeadas por peça, uma por componente.

**Nada de barra de etapas.** Indicador de progresso genérico era o terceiro
conceito descartado. O estado aparece pelo chip, que já é o vocabulário que a
abertura do átrio ensina.

**Estado vazio do preview também é informação.** Antes de digitar, o cartão
aparece com placeholder no idioma do produto ("sua ideia aparece aqui"), não
esqueleto cinza. É a primeira coisa que a pessoa vê e já ensina o formato.

## O que isso NÃO é

- Não é preview de markdown lado a lado. O corpo é longo e ninguém precisa ver
  markdown virando HTML em tempo real. O preview é do **cartão**, que é o objeto
  público da RFC.
- Não é gamificação. Nada de progresso percentual, medalha por preencher, nem
  "seu perfil está 60% completo" — isso é métrica de vaidade, `VISAO.md` §9.
- Não é wizard de várias etapas. Uma tela, um ato.

## Histórico

- 2026-08-01 — direção escolhida pela GNIX entre três: mostrar a consequência,
  a tela como bancada, ou situar no ciclo. As duas descartadas estão no
  histórico da conversa; a segunda leva o polo de papel pra dentro do app, que
  contradiz a escolha do polo macio pro Idearium.
