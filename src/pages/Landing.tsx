import { Bento } from '@/components/site/Bento'
import { Categorias } from '@/components/site/Categorias'
import { ChamadaFinal } from '@/components/site/ChamadaFinal'
import { Comparador } from '@/components/site/Comparador'
import { Comunidade } from '@/components/site/Comunidade'
import { Rankings } from '@/components/site/Rankings'
import { Hero } from '@/components/site/Hero'
import { LayoutSite } from '@/components/site/LayoutSite'
import { Marquee } from '@/components/site/Marquee'
import { SecaoDestinos } from '@/components/site/SecaoDestinos'
import { SecaoSocial } from '@/components/site/SecaoSocial'
import { Vitrine } from '@/components/site/Vitrine'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'

export function Landing() {
  useMetaDaPagina(
    'Voo, hotel e passeio numa busca só',
    'A BI&B varre companhias aéreas, hospedagens, passeios, restaurantes, eventos e locadoras nos 29 destinos do Rio de Janeiro, compara tudo lado a lado e fecha o orçamento da viagem.',
  )

  return (
    <LayoutSite ancorasInternas>
      <Hero />
      <Categorias />
      <Marquee />
      <Bento />
      <SecaoDestinos />
      <Vitrine />
      <Comparador />
      <Rankings />
      <SecaoSocial />
      <Comunidade />
      <ChamadaFinal />
    </LayoutSite>
  )
}
