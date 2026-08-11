import { useState, type CSSProperties } from 'react'
import { FOTOS, LARGURAS_FOTO, type Foto, type SlugFoto } from '@/data/fotos'
import css from './Imagem.module.css'

interface Props {
  slug: SlugFoto
  /**
   * Dica de largura para o navegador escolher no `srcset`. Sem isso ele assume
   * `100vw` e baixa a maior variante mesmo num cartão de 200px.
   */
  sizes: string
  /**
   * Imagem acima da dobra: sai do lazy loading e ganha prioridade de rede.
   * Use em no máximo uma por tela — é o candidato a LCP.
   */
  prioridade?: boolean
  /** Proporção da moldura. Sem valor, a moldura ocupa o tamanho do pai. */
  proporcao?: number
  /** Escurece a base para texto sobreposto. */
  veu?: boolean
  /** Aproxima levemente no hover. */
  zoom?: boolean
  /** Sobrescreve o texto alternativo do manifesto. */
  alt?: string
  className?: string
  style?: CSSProperties
}

/**
 * Foto do catálogo local.
 *
 * As três larguras e o LQIP saem de `scripts/gerar-fotos.mjs`. Nada aqui fala
 * com a rede de terceiros: os arquivos são servidos do mesmo domínio, em WebP,
 * e o navegador escolhe a variante pelo `sizes`.
 */
export function Imagem({
  slug,
  sizes,
  prioridade = false,
  proporcao,
  veu = false,
  zoom = false,
  alt,
  className,
  style,
}: Props) {
  const [estado, setEstado] = useState<'carregando' | 'pronta' | 'falhou'>('carregando')
  const foto: Foto | undefined = FOTOS[slug]

  /**
   * Slug fora do catálogo.
   *
   * `FOTOS[slug]` é tipado, mas o tipo não cobre dado que entra em tempo de
   * execução — um id vindo da URL, um catálogo regenerado sem aquele slug. Sem
   * esta guarda, `foto.lqip` lançava e derrubava a árvore inteira até o
   * ErrorBoundary: uma foto faltando levava a página junto.
   */
  if (!foto) return <Espaco className={className} style={style} proporcao={proporcao} />

  // O arquivo existe no catálogo mas não chegou pela rede — 404, disco cheio,
  // build sem `npm run fotos`. O LQIP embutido continua ali e é o suficiente
  // para o cartão não ficar com o ícone de imagem quebrada.
  if (estado === 'falhou') {
    return (
      <Espaco
        className={className}
        style={style}
        proporcao={proporcao ?? foto.proporcao}
        lqip={foto.lqip}
        rotulo={alt ?? foto.alt}
      />
    )
  }

  const carregada = estado === 'pronta'
  const srcSet = LARGURAS_FOTO.map((l) => `/fotos/${slug}-${String(l)}.webp ${String(l)}w`).join(', ')

  return (
    <div
      className={[css['moldura'], veu ? css['veu'] : null, zoom ? css['zoom'] : null, className]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...style,
        ...(proporcao ? { aspectRatio: String(proporcao) } : null),
        // O LQIP some assim que a foto real aparece: manter os dois empilhados
        // deixa a cor do borrão vazando pelas bordas em imagens com transparência.
        backgroundImage: carregada ? undefined : `url("${foto.lqip}")`,
      }}
    >
      <img
        className={[css['img'], carregada ? css['carregada'] : null].filter(Boolean).join(' ')}
        src={`/fotos/${slug}-960.webp`}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt ?? foto.alt}
        width={1600}
        height={Math.round(1600 / foto.proporcao)}
        loading={prioridade ? 'eager' : 'lazy'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => {
          setEstado('pronta')
        }}
        onError={() => {
          setEstado('falhou')
        }}
      />
    </div>
  )
}

/**
 * Moldura sem foto.
 *
 * Ocupa exatamente o mesmo espaço que a imagem ocuparia, então nada ao redor se
 * desloca quando ela falha. Quando há LQIP, ele fica ampliado e desfocado — a
 * cor média da cena é mais informativa que um retângulo cinza, e não parece
 * defeito.
 */
function Espaco({
  className,
  style,
  proporcao,
  lqip,
  rotulo,
}: {
  className?: string
  style?: CSSProperties
  proporcao?: number
  lqip?: string
  rotulo?: string
}) {
  return (
    <div
      className={[css['moldura'], css['vazia'], className].filter(Boolean).join(' ')}
      style={{
        ...style,
        ...(proporcao ? { aspectRatio: String(proporcao) } : null),
        ...(lqip ? { backgroundImage: `url("${lqip}")` } : null),
      }}
      role="img"
      aria-label={rotulo ?? 'Imagem indisponível'}
    >
      {lqip ? null : (
        <span className={css['vaziaIcone']} aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
            <circle cx="8.4" cy="9.6" r="1.5" />
            <path d="m3.6 17.4 5-5 4.4 4.4 3-3 4.4 4.4" />
          </svg>
        </span>
      )}
    </div>
  )
}
