# Átrio v2

> Explorações do átrio. Cada direção leva **uma** referência até o fim, em vez
> de aplicá-la como pele. Conteúdo idêntico em todas, pra comparação honesta.

Comece por **[`compare.html`](compare.html)** (só cobre as três de papel) ou
abra direto a **[`materia.html`](materia.html)**, que é a direção mais recente.

Nada foi escolhido. Nada foi portado pra `apps/web/`.

## Por que este track existe

O `kare-os/` foi escolhido como direção oficial, mas o que chegou em
`apps/web/src/pages/atrio.astro` não é o Kare OS. O comentário no topo do
arquivo admite: *"Aesthetic Kare nas peças (NeueBit, paleta cobalto+cream+
yellow+ink) mas layout puro editorial — zero painéis"*.

A tese do handoff Kare era forte — *"ideas are software, RFCs are programs in
execution"* — mas metáfora de sistema operacional só sustenta peso se a
interface **se comportar** como um sistema. Aplicada como pele (fonte pixelada
+ cobalto + halftone sobre layout de blog), lê como blog com fonte de pixel.
Não é falta de gosto: é metáfora meio-aplicada.

## Escopo travado antes de desenhar

Decisão de 24.07.2026: Idearium é **problema social resolvido com software**.
O `VISAO.md` fica como está, labs seguem sendo domínios. Consequência:

> O sinal de "tech" **não pode vir dos eixos dos labs**. Tem que vir da
> evidência de construção na superfície.

O átrio atual mostra prosa e contagens, que é vocabulário da metade cívica.
`47 ideias`, `128 builders` são métricas de vaidade, proibidas pelo VISAO §9.
Trilha de trabalho não é.

## As direções

| arquivo | referência | achado estrutural |
|---|---|---|
| [`materia.html`](materia.html) | craft.do (acabamento) + o painel da GNIX | O dado da RFC **é** a imagem: dither Bayer sobre o pastel do lab |
| [`bancada.html`](bancada.html) | Caderno de laboratório (séc. XIX) | **Errata**: texto riscado com a correção ao lado, datada |
| [`certificado.html`](certificado.html) | Sol LeWitt, *Wall Drawings* (1968–) | **Execuções**: a mesma RFC realizada N vezes, nenhuma canônica |
| [`catalogo.html`](catalogo.html) | *Whole Earth Catalog* (1968–74) | **Bloco de acesso**: o que falta pra construir |

As três últimas partilham um substrato só — papel. A `materia.html` nasceu da
crítica da GNIX a isso.

### materia.html

Polo macio, decodificado medindo o craft.do (não a olho):

| | valor |
|---|---|
| fundo | `#FCF9F7` off-white quente |
| tinta | `rgb(3,3,2)` com alpha .9/.75/.65/.5 — **uma** tinta, nunca cinzas nomeados |
| peso | **400** dominante; ênfase por incremento fracionário (430, 450, 470) |
| raio | 24 externo / 14 interno — externo = interno + padding |
| sombra | `0 50px 40px rgba(0,0,0,.01)` em camadas: enorme e quase invisível |
| acento | pastéis **dessaturados** (menta, amarelo), não saturados |

Três coisas próprias dela:

1. **Abertura antes de qualquer RFC.** Quem chega não sabe o que é RFC nem lab.
   As quatro etapas explicam o ciclo **ensinando o vocabulário** — cada etapa
   mostra o chip de estado que produz (`rascunho` → `em discussão` →
   `em construção` → `publicada`), então o chip no cartão abaixo já faz sentido.
2. **Pastel como fundo, tinta como traço.** Pastel dessaturado não tem
   contraste pra desenhar o dither. Invertendo, ganha legibilidade e coerência
   com a regra de uma tinta só.
3. **Barrinhas não medem prazo.** Cada uma é um passo dado. Numa RFC voluntária
   não há prazo, e porcentagem viraria métrica de vaidade.

O "fofo" de craft/cofounder/agentation não está na paleta: está em dezenas de
micro-animações CSS escritas à mão, uma por componente. Por isso as animações
aqui são nomeadas por peça e disparadas por IntersectionObserver.

## Pixel art

| arquivo | o que é |
|---|---|
| [`deck-pixelart.html`](deck-pixelart.html) | 10 briefings: 6 tratamentos do mesmo assunto (isola estilo) + 4 assuntos |
| [`prompt-chatgpt.md`](prompt-chatgpt.md) | Prompt mestre + os 10 pedidos, tabela de correção por sintoma |
| `images/` | as 7 geradas no ChatGPT (cena-mãe + 6 labs) |
| `images/processadas/` | as mesmas nos tamanhos do layout |
| [`grade.py`](grade.py) | detecta o tamanho do bloco de pixel de uma imagem |
| [`processa.py`](processa.py) | recorta, reduz e quantiza pros tamanhos do layout |

### O que a medição revelou

`grade.py` nas 7 fontes: **confiança de grade 0.32–0.37** e **10 a 18 mil cores
únicas**. Ou seja, não existe grade de pixel consistente — os blocos têm
tamanhos misturados (2, 3, 4, 5, 6px). É "pixel falso": bonito na tela grande,
desmancharia de perto.

Isso corrige uma instrução dada antes neste track. **Nearest neighbor está
errado aqui.** Nearest *preserva* grade existente; sem grade, ele amostra
pixels ao acaso e cria ruído. O caminho é reduzir por **média de área** e
**quantizar a paleta** — a grade é criada no tamanho final, não destruída.

A quantização usa **dither Bayer**, o mesmo algoritmo do canvas da
`materia.html`, então arte de lab e dado de RFC falam o mesmo idioma.

Resultado: de 10–18 mil cores para **7–11 cores**.

```bash
python3 grade.py images/*.png       # medir
python3 processa.py                 # gerar images/processadas/
```

### Pendências conhecidas nas imagens

- **A cena-mãe e o Lab. Cultura têm a mesma paleta** (`#FDE99B`). Erro do
  briefing. No layout aparecem próximas e vão brigar. Regerar Cultura com outro
  pastel.
- **A fita de lab de 168×54 é pequena demais** pra essas cenas. A
  `lab-solidaria` fica ilegível. Ou aumentar a altura da fita no layout, ou usar
  as artes só nas páginas de lab e manter a fita em cor sólida.
- Faltam as três de RFC (pedidos 08, 09, 10 do `prompt-chatgpt.md`). Enquanto
  não existirem, as RFCs seguem com o dado ditherizado gerado em canvas — o que
  é coerente: **arte para identidade de lab, dado para conteúdo de RFC**.

## Licença de fontes

Nenhuma direção usa **PP Mondwest** ou **PP NeueBit**. São *free for personal
use*, e `apps/web/src/styles/global.css` já sinaliza o risco — site público não
costuma caber nessa licença, mesmo sem fins comerciais.

| fonte | licença | onde |
|---|---|---|
| Inter | OFL | materia (tudo) |
| Newsreader | OFL | materia (itálico de acento), bancada |
| Departure Mono | MIT | materia (dado, números) |
| Courier Prime | OFL | bancada, catálogo |
| Archivo / Archivo Narrow | OFL | certificado, catálogo |
| Spectral | OFL | catálogo |
| IBM Plex Mono | OFL | certificado |

A Departure Mono (Helena Zhang & Tobias Fried) é a mono do cofounder.co. Dá
sabor de pixel sem o cosplay de Press Start 2P, e sendo MIT cabe num projeto
CC BY-SA. Está via jsDelivr nos mockups; em produção, self-host. Por ser pixel
font, só usar em corpos inteiros (10/11/12px) — em corpo fracionário a grade
borra.

## Como abrir

CSS puro, sem build. Abre com `file://`, exceto se o navegador bloquear
`canvas.getImageData` — nesse caso sirva por HTTP:

```bash
cd brainstorming-design && python3 -m http.server 8347
# http://localhost:8347/atrio-v2/materia.html
```

## Estado

O conteúdo é fixture: as mesmas RFCs de `apps/web/src/pages/atrio.astro`
(RFC-0007, RFC-0011, RFC-0014), os 6 labs, a mesma frase-âncora. Se o conteúdo
variasse entre as direções, a comparação seria desonesta.

Falta em todas: página de RFC, composição, autenticação, estados de vazio. São
átrios, não sistemas.

Pendente: `compare.html` não lista a `materia.html` nem o deck. E duas direções
discutidas não foram escritas — Console (fundo escuro, chips de status com glow)
e Inline (UI dentro da frase, como o Fly.io).

## Histórico

- 2026-07-24 — track criado. Diagnóstico do Kare OS meio-aplicado, escopo
  travado, três direções de papel (caderno de lab, LeWitt, Whole Earth).
- 2026-07-25 — `materia.html` a partir do painel de referências da GNIX e do
  craft.do decodificado. Deck de pixel art, prompt, 7 imagens geradas e
  processadas.
