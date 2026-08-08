import { Suspense, lazy, useEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BarraProgresso, Fundo } from "@/components/ui/Fundo";
import { PularParaConteudo } from "@/components/ui/PularParaConteudo";
import { Carregando } from "@/components/ui/Carregando";
import { useMovimentoReduzido } from "@/hooks/useMovimento";
import { Landing } from "@/pages/Landing";

/**
 * A plataforma carrega sob demanda.
 *
 * Quem chega pela home — a maioria — baixa só o site institucional. O código da
 * plataforma (filtros, roteiro, mapa, painel, chat) só entra na rede quando
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
const NaoEncontrada = lazy(() =>
  import("@/pages/NaoEncontrada").then((m) => ({ default: m.NaoEncontrada })),
);

export function App() {
  const location = useLocation();
  const semMovimento = useMovimentoReduzido();

  return (
    /**
     * O Motion segue a mesma preferência resolvida que o CSS, e não a media
     * query crua: usar `reducedMotion="user"` faria a biblioteca consultar o
     * sistema por conta própria e ignorar a escolha explícita do usuário — o
     * site ficaria metade animado, metade parado.
     */
    <MotionConfig reducedMotion={semMovimento ? "always" : "never"}>
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
            <Route
              path="/plataforma"
              element={<Navigate to="/plataforma/voos" replace />}
            />
            <Route path="/plataforma/:aba" element={<Plataforma />} />
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
