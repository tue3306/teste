/**
 * Baixa as fotos do manifesto, otimiza e gera o módulo de metadados.
 *
 *   npm run fotos
 *
 * Por que um passo de build e não `fetch` em tempo de execução:
 *
 * - Sem requisição a terceiro no carregamento da página. Nada de latência de
 *   rede alheia, rate limit ou CORS entre o usuário e a primeira imagem.
 * - As imagens saem em WebP, em três larguras, servidas do mesmo domínio — que
 *   é o que o LCP precisa.
 * - Cada arquivo carrega autor e licença do Commons, então a atribuição fica
 *   verificável em vez de decorativa.
 *
 * Saída:
 *   public/fotos/<slug>-<largura>.webp
 *   src/data/fotos.ts   (metadados + LQIP embutido)
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { LARGURAS, MANIFESTO } from './manifesto-fotos.mjs'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const destino = resolve(raiz, 'public/fotos')
const AGENTE = 'BIB-site/1.0 (https://bib.com.br; contato@bib.com.br)'

/** `true` quando chamado com `--forcar`: rebaixa tudo, ignorando o cache. */
const forcar = process.argv.includes('--forcar')

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': AGENTE, Accept: 'application/json' } })
  if (!r.ok) throw new Error(`${String(r.status)} em ${url}`)
  return r.json()
}

/** Imagem principal do artigo, via REST da Wikipédia. */
async function resumo(titulo) {
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
  const dados = await json(url)
  if (!dados.originalimage?.source) throw new Error(`sem imagem principal: ${titulo}`)
  return {
    imagem: dados.originalimage.source.split('?')[0],
    pagina: dados.content_urls?.desktop?.page ?? `https://pt.wikipedia.org/wiki/${encodeURIComponent(titulo)}`,
  }
}

/** Autor e licença do arquivo no Commons. */
async function creditos(urlImagem) {
  const arquivo = decodeURIComponent(urlImagem.split('/').pop() ?? '')
  const api =
    'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
    `&titles=${encodeURIComponent(`File:${arquivo}`)}` +
    '&prop=imageinfo&iiprop=extmetadata&iiextmetadatafilter=Artist|LicenseShortName|LicenseUrl'

  try {
    const dados = await json(api)
    const paginas = dados.query?.pages ?? {}
    const meta = Object.values(paginas)[0]?.imageinfo?.[0]?.extmetadata ?? {}
    const limpar = (v) =>
      v ? String(v).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : null
    return {
      autor: limpar(meta.Artist?.value) ?? 'Wikimedia Commons',
      licenca: limpar(meta.LicenseShortName?.value) ?? 'ver página do arquivo',
      arquivo: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo)}`,
    }
  } catch {
    return {
      autor: 'Wikimedia Commons',
      licenca: 'ver página do arquivo',
      arquivo: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(arquivo)}`,
    }
  }
}

/**
 * Miniatura embutida (LQIP): 20px de largura em base64.
 * Aparece desfocada enquanto a foto real chega, no lugar de um buraco branco.
 */
async function lqip(buffer) {
  const b = await sharp(buffer).resize(20).webp({ quality: 30 }).toBuffer()
  return `data:image/webp;base64,${b.toString('base64')}`
}

await mkdir(destino, { recursive: true })

const registros = []
const falhas = []

for (const item of MANIFESTO) {
  const maiorArquivo = resolve(destino, `${item.slug}-${String(LARGURAS.at(-1))}.webp`)

  // Cache: se os arquivos já existem e o metadado foi gravado, pula a rede.
  const cacheado = !forcar && existsSync(maiorArquivo)

  try {
    const { imagem, pagina } = await resumo(item.titulo)
    const credito = await creditos(imagem)

    let proporcao = 3 / 2
    if (!cacheado) {
      const resposta = await fetch(imagem, { headers: { 'User-Agent': AGENTE } })
      if (!resposta.ok) throw new Error(`${String(resposta.status)} ao baixar ${imagem}`)
      const original = Buffer.from(await resposta.arrayBuffer())

      const meta = await sharp(original).metadata()
      proporcao = (meta.width ?? 3) / (meta.height ?? 2)

      for (const largura of LARGURAS) {
        await sharp(original)
          .resize({ width: largura, withoutEnlargement: true })
          .webp({ quality: 74, effort: 5 })
          .toFile(resolve(destino, `${item.slug}-${String(largura)}.webp`))
      }

      registros.push({ ...item, ...credito, pagina, proporcao, lqip: await lqip(original) })
      console.log(`✓ ${item.slug}`)
    } else {
      const meta = await sharp(maiorArquivo).metadata()
      proporcao = (meta.width ?? 3) / (meta.height ?? 2)
      registros.push({
        ...item,
        ...credito,
        pagina,
        proporcao,
        lqip: await lqip(await readFile(maiorArquivo)),
      })
      console.log(`· ${item.slug} (cache)`)
    }
  } catch (erro) {
    falhas.push({ slug: item.slug, motivo: erro.message })
    console.warn(`✗ ${item.slug}: ${erro.message}`)
  }
}

const modulo = `/**
 * GERADO por scripts/gerar-fotos.mjs — não edite à mão.
 * Regenere com \`npm run fotos\`.
 *
 * Cada foto vem do Wikimedia Commons sob licença livre. Autor e licença estão
 * registrados aqui e aparecem nos créditos do rodapé.
 */

export interface Foto {
  /** Chave usada no código. */
  slug: string
  /** Texto alternativo, descrevendo a cena. */
  alt: string
  /** Larguras disponíveis, para montar o \`srcset\`. */
  larguras: number[]
  /** Proporção largura/altura do original, para reservar o espaço no layout. */
  proporcao: number
  /** Miniatura embutida exibida desfocada durante o carregamento. */
  lqip: string
  autor: string
  licenca: string
  /** Página do arquivo no Commons. */
  arquivo: string
  /** Artigo de origem na Wikipédia. */
  pagina: string
}

export const LARGURAS_FOTO = ${JSON.stringify(LARGURAS)} as const

export const FOTOS = {
${registros
  .map(
    (r) => `  '${r.slug}': {
    slug: '${r.slug}',
    alt: ${JSON.stringify(r.alt)},
    larguras: ${JSON.stringify(LARGURAS)},
    proporcao: ${r.proporcao.toFixed(4)},
    lqip: '${r.lqip}',
    autor: ${JSON.stringify(r.autor)},
    licenca: ${JSON.stringify(r.licenca)},
    arquivo: ${JSON.stringify(r.arquivo)},
    pagina: ${JSON.stringify(r.pagina)},
  },`,
  )
  .join('\n')}
} as const satisfies Record<string, Foto>

export type SlugFoto = keyof typeof FOTOS
`

await writeFile(resolve(raiz, 'src/data/fotos.ts'), modulo, 'utf8')

console.log(`\n${String(registros.length)} fotos prontas em public/fotos/`)
if (falhas.length) {
  console.log(`${String(falhas.length)} falharam:`)
  for (const f of falhas) console.log(`  - ${f.slug}: ${f.motivo}`)
  process.exitCode = 1
}
