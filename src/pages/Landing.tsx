import { Bento } from '@/components/site/Bento'
import { Categorias } from '@/components/site/Categorias'
import { ChamadaFinal } from '@/components/site/ChamadaFinal'
import { Comparador } from '@/components/site/Comparador'
import { Hero } from '@/components/site/Hero'
import { LayoutSite } from '@/components/site/LayoutSite'
import { Marquee } from '@/components/site/Marquee'
import { SecaoBia } from '@/components/site/SecaoBia'
import { SecaoDestinos } from '@/components/site/SecaoDestinos'
import { SecaoRoteiro } from '@/components/site/SecaoRoteiro'
import { SecaoSocial } from '@/components/site/SecaoSocial'
import { Vitrine } from '@/components/site/Vitrine'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'

export function Landing() {
  useMetaDaPagina(
    'Voo, hotel e roteiro numa busca só',
    'A BI&B varre companhias aéreas, hospedagens, passeios e restaurantes ao mesmo tempo, compara tudo lado a lado e monta seu roteiro dia por dia. Melhor preço garantido.',
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
      <SecaoRoteiro />
      <SecaoBia />
      <SecaoSocial />
      <ChamadaFinal />
    </LayoutSite>
  )
}
