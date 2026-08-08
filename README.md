# BI&B

Planejamento de viagem inteligente: voo, hospedagem, passeios e roteiro numa
busca só. O projeto tem duas metades no mesmo código — o site institucional
(`/`) e a plataforma logada (`/plataforma/:aba`).

Stack: **Vite 7 · React 19 · TypeScript 5.9 · React Router 7 · Motion 13**, com
CSS Modules sobre tokens. Sem framework de UI e sem biblioteca de CSS.

---

## Começando

```bash
npm install
npm run dev
```

| Comando             | O que faz                                                        |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento em http://localhost:5173              |
| `npm run build`     | Typecheck + build de produção em `dist/`                          |
| `npm run preview`   | Serve o `dist/` para conferir o build                             |
| `npm run lint`      | ESLint (TypeScript com tipos, React Hooks, jsx-a11y estrito)      |
| `npm run typecheck` | Só o `tsc`, sem gerar nada                                        |
| `npm run fotos`     | Rebaixa e otimiza as fotos do Wikimedia (veja abaixo)             |
| `npm run assets`    | Regenera `og-image.png` e `apple-touch-icon.png`                  |

> **Não use `&` no caminho da pasta.** No Windows, o `cmd.exe` trata `&` como
> separador de comando e corta ao meio o `PATH` que o npm monta para os scripts —
> `npm run dev` falha com "não é reconhecido como comando". Foi por isso que a
> pasta se chama `BIB` e não `BI&B`. O nome do produto segue BI&B em todo lugar.

---

## Estrutura

```
src/
  components/
    site/       seções da landing (hero, comparador, vitrine, rodapé…)
    app/        telas da plataforma (lista, filtros, roteiro, mapa, painel)
    ui/         primitivas compartilhadas (Botão, Imagem, Diálogo, Esqueleto…)
    ChatBia     o chat, usado pelo site e pela plataforma
  config/       leitura tipada do ambiente
  context/      estado da viagem (favoritos, reservas, roteiro, chat)
  data/         catálogo, roteiro, destinos e o índice de fotos gerado
  hooks/        useReveal, useCountUp, useRecurso, useLocalStorage…
  lib/          formatação pt-BR e o motor de respostas da Bia
  pages/        Landing, Plataforma, NaoEncontrada
  services/     clientes HTTP das APIs externas
  styles/       tokens, reset, animações e primitivas de layout
scripts/        geração de fotos e de assets sociais
_prototipo/     export original do Design Canvas, mantido como referência
```

O `_prototipo/` não entra no build nem no lint. Fica ali como fonte da verdade
visual, para comparar o resultado com o desenho original.

---

## Design system

Tudo começa em `src/styles/tokens.css`. Componente não escreve hex literal:
pede o token. Cores, escala tipográfica, raios, sombras, espaçamento e o tempo
das transições vivem lá.

**Sobre contraste.** O protótipo pintava texto secundário com
`rgba(20,49,47,.38….62)` sobre areia, o que rende 2,9:1–3,9:1 e reprova no WCAG
AA. Os tokens `--ink-2` (6,4:1) e `--ink-3` (4,9:1) são sólidos e medidos. As
cores de marca ganharam três papéis distintos, porque um tom só não dá conta:

| Papel        | Token                          | Onde usar                                  |
| ------------ | ------------------------------ | ------------------------------------------ |
| Preenchimento | `--teal` / `--coral`          | fundos, ícones, traços, gráficos           |
| Superfície com texto branco | `--teal-strong` / `--coral-strong` | botões primários (≥4,5:1 com branco) |
| Texto sobre claro | `--teal-text` / `--coral-text` | números, links, destaques em texto         |

`#FF7A59` com texto branco dá 2,57:1 — bonito e ilegível. `--coral-strong`
(`#CF471E`) mantém a família e passa em 4,6:1.

**Movimento.** Todo o CSS depende do atributo `data-motion` no `<html>`, e não
da media query `prefers-reduced-motion` direto. O atributo carrega a preferência
**resolvida**: o pedido do sistema operacional, que pode ser sobreposto por uma
escolha explícita guardada no aparelho (`bib:movimento`).

Isso resolve um problema concreto. No Windows, desligar "efeitos de animação"
faz o navegador anunciar `prefers-reduced-motion: reduce` para **todo** site — e
quem mexeu naquele interruptor pensando no desempenho da máquina raramente
imagina que apagou a animação da web inteira. O padrão continua sendo obedecer
ao sistema; o que existe agora é como dizer o contrário, pelo seletor no rodapé.

O valor é calculado por um script embutido no `index.html`, antes da primeira
pintura — sem ele a página apareceria animada por um instante antes de o React
montar e corrigir. `src/hooks/useMovimento.ts` é a fonte de verdade única,
consumida tanto pelo CSS quanto pelo `MotionConfig`.

---

## Integrações externas

### Ativas agora, sem nenhuma configuração

| Serviço                    | Para quê                       | Onde                                  |
| -------------------------- | ------------------------------ | ------------------------------------- |
| **Open-Meteo**             | Previsão de 7 dias do destino  | `src/services/clima.ts`               |
| **Open-Meteo Geocoding**   | Autocomplete de cidades do BR  | `src/services/lugares.ts`             |
| **ViaCEP**                 | Endereço a partir do CEP       | `src/services/cep.ts`                 |
| **Wikimedia Commons**      | Fotos de destinos e pontos     | `scripts/gerar-fotos.mjs` (build)     |
| **OpenStreetMap**          | Mapa da viagem (Leaflet)       | `src/components/ui/Mapa.tsx`          |

As três primeiras são públicas, gratuitas e respondem com
`Access-Control-Allow-Origin: *`, então o navegador chama direto — sem proxy e
sem chave. Foi por isso que ficaram na frente de OpenWeather e Google Places:
qualquer chave embutida no bundle é chave publicada.

Defina `VITE_APIS_ABERTAS=false` para desligar toda chamada externa (útil em
teste automatizado ou ambiente sem rede). A interface degrada sozinha: a
previsão some, o autocomplete vira campo de texto comum.

### Fotos

`npm run fotos` lê `scripts/manifesto-fotos.mjs`, busca a imagem principal de
cada artigo na Wikipédia, baixa do Commons, gera WebP em 480/960/1600 px, extrai
autor e licença, produz um LQIP embutido e escreve `src/data/fotos.ts`.

Isso é um passo de build, e não `fetch` em tempo de execução, por três razões:
nenhuma requisição a terceiro entra no caminho crítico do usuário; as imagens
saem otimizadas e do mesmo domínio, que é o que o LCP precisa; e a atribuição
fica registrada em vez de decorativa — o rodapé lista autor e licença de cada
foto a partir do mesmo arquivo.

Para trocar uma foto: edite o título no manifesto e rode `npm run fotos`. Nenhum
componente muda.

### Precisam de backend

Amadeus, Hotelbeds, Booking, Expedia e Google Places **não podem** ser chamados
do navegador — todos exigem segredo de cliente ou assinatura de requisição, e
Booking/Expedia só liberam a API sob contrato de afiliado.

O desenho previsto: um backend seu guarda os segredos, fala com os provedores e
devolve `Oferta[]` normalizado. O front conhece só `VITE_API_BASE`.

```
GET {VITE_API_BASE}/ofertas?vertical=voos|hoteis|passeios&destino=…&lat=…&lon=…
→ 200 { "ofertas": Oferta[] }
```

O tipo `Oferta` está em `src/types/index.ts`. Sem `VITE_API_BASE`, a plataforma
usa o catálogo local e `buscarOfertas` devolve `origem: 'local'` — e se o backend
existir mas cair, ela volta para o catálogo local em vez de mostrar tela vazia.
Ver `src/services/provedores.ts`.

Todas as variáveis estão documentadas em `.env.example`. Copie para `.env.local`.

---

## Rotas

| Rota                  | Página                                            |
| --------------------- | ------------------------------------------------- |
| `/`                   | Landing                                           |
| `/plataforma/:aba`    | Plataforma (voos, hoteis, passeios, roteiro, mapa, dashboard, bia) |
| `/sobre`              | Sobre a empresa                                   |
| `/privacidade`        | Privacidade e dados                               |
| `/termos`             | Termos de uso                                     |
| `/contato`            | Contato, com formulário                           |
| `*`                   | 404                                               |

As três institucionais compartilham o componente `Institucional` mas têm rota
própria cada uma. Um `/:slug` genérico engoliria qualquer endereço errado e o
404 nunca apareceria — e, como a página redireciona slug desconhecido, o destino
do redirecionamento casaria com o mesmo `/:slug` e fecharia um laço.

**Privacidade e Termos trazem aviso visível de revisão jurídica pendente.** O
texto descreve com precisão o que o código faz — quais chaves vão para o
`localStorage`, quais APIs são chamadas, que não há cookie nem rastreador. Isso é
verificável lendo `src/services/`. O que ele não é: documento revisado por
advogado. Redigir cláusula com aparência de definitiva sem revisão é como um
cliente publica algo que não o protege.

---

## Decisões que valem explicação

**Rotas em vez de estado.** A aba é segmento de rota e a categoria é parâmetro de
busca. No protótipo tudo era estado interno e a URL nunca mudava — o botão
voltar saía do site, e não dava para compartilhar link nem recarregar a página
sem perder o lugar.

**Responsividade em CSS, não em JavaScript.** O protótipo guardava
`window.innerWidth` no estado e montava `grid-template-columns` em JS. Isso
re-renderiza a árvore inteira a cada pixel de resize e ignora zoom. Aqui são
media queries.

**Reordenar por botão, não por arrasto.** A copy do protótipo prometia "arraste
para reorganizar". Arrastar exclui quem usa teclado e é impreciso no toque; dois
botões funcionam nos três casos e são anunciados corretamente. A copy foi
ajustada para o que o produto faz.

**Estado de carregamento derivado.** `useRecurso` não guarda "carregando": se o
último resultado não veio da busca atual, é porque ela está em voo. Guardar isso
exigiria `setState` no corpo do efeito, que força um render em cascata a cada
busca.

**Entrada de conteúdo é CSS; Motion é para interação.** O Motion escreve estilo
inline a cada quadro de `requestAnimationFrame`, e uma aba aberta em segundo
plano não recebe quadro nenhum — um elemento com `initial={{ opacity: 0 }}`
ficaria invisível até o usuário focar a aba. O CSS declara o alvo e o navegador
resolve, visível ou não. Por isso a entrada por scroll usa a classe `.reveal`
(com rede de segurança de 1,2s) e o Motion fica onde só ele resolve: animação de
layout ao reordenar a lista, indicador de aba com `layoutId` e parallax ligado
ao scroll.

**Grades usam `minmax(0, 1fr)`, não `1fr`.** `1fr` equivale a
`minmax(auto, 1fr)`, e esse mínimo é o `min-content` da coluna: um cartão com
ícone de 46px e texto sem quebra estabelece piso de 150px, e duas colunas dessas
vazam de uma tela de 320px. Com o mínimo em zero, a coluna manda no conteúdo.

**Navegação nunca espera animação.** A transição entre páginas usava
`AnimatePresence mode="wait"`, que só monta a página nova quando a saída da
anterior termina — e uma aba em segundo plano não recebe quadro de
`requestAnimationFrame`, então a saída nunca concluía e o clique não levava a
lugar nenhum: a URL mudava e a tela não. Agora a `key` na rota troca a árvore na
hora e a página entra desvanecendo por cima.

**Privacidade sem teatro.** Não há cookie nem rastreador; o que existe é
`localStorage` com preferências do próprio usuário. Pela LGPD isso não exigiria
consentimento prévio, mas informar e permitir apagar continua valendo — por isso
"não guardar nada" apaga de verdade e interrompe novas gravações, em vez de
fechar uma caixa e seguir gravando igual. `src/hooks/useConsentimento.ts`.

**O chat move `scrollTop`, nunca `scrollIntoView`.** `scrollIntoView` rola
**todos** os ancestrais roláveis, inclusive o documento. Como a conversa também
vive no meio da landing, a versão que usava `scrollIntoView` abria a home já
rolada até a seção da Bia. Mover `scrollTop` do próprio container não toca no
scroll da página.

---

## Acessibilidade

Verificado com medição no DOM, não no olho:

- Contraste AA em todo texto visível (medido compondo alfa sobre o fundo real).
- Alvos de toque ≥24px (WCAG 2.2 SC 2.5.8), exceto links inline em texto corrido,
  que o critério isenta.
- Foco visível em todo elemento interativo, via `:focus-visible` global.
- Sem rolagem horizontal de 320px a 2560px.
- `aria-live` no chat, na reordenação do roteiro e ao adicionar ponto ao roteiro.
- Combobox de destino segue o padrão ARIA, com `aria-activedescendant`.
- Checklist com `<input type="checkbox">` de verdade; filtros com `aria-pressed`.
- Comparador é `<table>` com cabeçalho e legenda.
- `prefers-reduced-motion` respeitado em toda animação.

---

## Deploy

`npm run build` gera `dist/`, estático puro. Serve em qualquer lugar.

Como é SPA, o servidor precisa devolver `index.html` para qualquer rota — senão
`/plataforma/roteiro` dá 404 no reload. Vercel e Netlify fazem isso com um
rewrite de `/*` para `/index.html`.

Antes de publicar, ajuste `VITE_SITE_URL` e as URLs absolutas em `index.html`,
`public/sitemap.xml` e `public/robots.txt`, que hoje apontam para
`https://bib.com.br`.
