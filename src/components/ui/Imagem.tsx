import { useState, type CSSProperties } from 'react'
import { FOTOS, LARGURAS_FOTO, type SlugFoto } from '@/data/fotos'
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
  const [carregada, setCarregada] = useState(false)
  const foto = FOTOS[slug]

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
          setCarregada(true)
        }}
      />
    </div>
  )
}
