import { Suspense, lazy, useEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BarraProgresso, Fundo } from "@/components/ui/Fundo";
import { PularParaConteudo } from "@/components/ui/PularParaConteudo";
import { Carregando } from "@/components/ui/Carregando";
import { Landing } from "@/pages/Landing";

/**
 * A plataforma carrega sob demanda.
 *
 * Quem chega pela home — a maioria — baixa só o site institucional. O código da
 * plataforma (filtros, destinos, mapa, orçamento) só entra na rede quando
 * alguém realmente abre `/plataforma`.
 */
const Plataforma = lazy(() =>
  import("@/pages/Plataforma").then((m) => ({ default: m.Plataforma })),
);
const Institucional = lazy(() =>
  import("@/pages/Institucional").then((m) => ({ default: m.Institucional })),
);
const Contato = lazy(() =>
  import("@/pages/Contato").then((m) => ({ default: m.Contato })),
);
const DestinoDetalhe = lazy(() =>
  import("@/pages/DestinoDetalhe").then((m) => ({ default: m.DestinoDetalhe })),
);
const NaoEncontrada = lazy(() =>
  import("@/pages/NaoEncontrada").then((m) => ({ default: m.NaoEncontrada })),
);

export function App() {
  const location = useLocation();

  return (
    /**
     * `reducedMotion="never"`, sempre — e isso é deliberado.
     *
     * Este prop, em `"always"`, não "suaviza" nada: ele desliga **todo**
     * `transform`, `layout` e `whileHover` da árvore inteira do Motion. Entrada
     * de cartão, pílula que desliza entre abas, elevação no hover, parallax —
     * tudo morre de uma vez. No Windows, desligar "efeitos de animação" (coisa
     * que muita gente faz pensando no desempenho da máquina) liga
     * `prefers-reduced-motion` para a web inteira, e o site chegava
     * completamente estático para essas pessoas.
     *
     * A preferência continua respeitada, mas pelo critério certo: **amplitude**,
     * declarada componente a componente. Parallax e tilt — que deslocam muito e
     * acompanham o scroll — são contidos; entrada, hover e transição de layout
     * continuam rodando, com deslocamento menor. Ver `src/lib/motion.ts`.
     */
    <MotionConfig reducedMotion="never">
      <PularParaConteudo />
      <Fundo />
      <BarraProgresso />
      <RolarAoTrocarDeRota />

      <Suspense fallback={<Carregando />}>
        {/**
         * Transição entre páginas — só de entrada, sem `AnimatePresence`.
         *
         * A versão anterior usava `AnimatePresence mode="wait"`, que só monta a
         * página nova quando a animação de saída da anterior termina. Isso
         * amarra a navegação a um quadro de `requestAnimationFrame`: numa aba em
         * segundo plano, que não recebe quadro nenhum, a saída nunca conclui e o
         * clique simplesmente não leva a lugar nenhum — a URL muda e a tela não.
         *
         * Com a `key` na rota, o React troca a árvore na hora e a página nova
         * entra desvanecendo por cima. Navegar nunca espera por animação.
         */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Landing />} />

            {/**
             * A plataforma é aberta. Não há login: planejar uma viagem não
             * deveria exigir cadastro, e o que a pessoa monta vive no
             * armazenamento do próprio navegador — ver `lib/armazenamento.ts`.
             */}
            <Route
              path="/plataforma"
              element={<Navigate to="/plataforma/destinos" replace />}
            />
            <Route path="/plataforma/:aba" element={<Plataforma />} />

            {/* Página pública de cada um dos 29 destinos. Fica fora da
                plataforma de propósito: é conteúdo, indexável, e serve de porta
                de entrada para quem chega por busca. */}
            <Route path="/destino/:id" element={<DestinoDetalhe />} />

            <Route path="/contato" element={<Contato />} />

            {/**
             * Sobre, Privacidade e Termos compartilham um componente, mas
             * cada uma tem rota própria. Um `/:slug` genérico engoliria
             * qualquer endereço errado e o 404 nunca apareceria — pior, a
             * página redireciona o slug desconhecido, e o destino do
             * redirecionamento casaria com o mesmo `/:slug`, fechando um laço.
             */}
            <Route path="/sobre" element={<Institucional />} />
            <Route path="/privacidade" element={<Institucional />} />
            <Route path="/termos" element={<Institucional />} />

            <Route path="*" element={<NaoEncontrada />} />
          </Routes>
        </motion.div>
      </Suspense>
    </MotionConfig>
  );
}

/**
 * Volta ao topo a cada troca de rota — menos quando a URL traz uma âncora, caso
 * em que o navegador já sabe para onde ir.
 *
 * O `behavior: 'instant'` é deliberado: `scroll-behavior: smooth` está ativo no
 * documento para os links de âncora, e sem esta ressalva o salto entre páginas
 * viraria uma rolagem animada de vários segundos.
 */
function RolarAoTrocarDeRota() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
