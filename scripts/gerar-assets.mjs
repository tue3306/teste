/**
 * Gera os bitmaps estáticos a partir de SVG.
 *
 * Redes sociais não renderizam SVG em `og:image` e o iOS quer PNG no
 * `apple-touch-icon` — os dois precisam de bitmap. Manter o SVG como fonte e
 * derivar o PNG por script evita que o cartão de compartilhamento saia do ar
 * quando a marca mudar: edite o SVG, rode `npm run assets`.
 *
 *   node scripts/gerar-assets.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publico = resolve(raiz, 'public')

const AREIA = '#FBF6EE'
const TINTA = '#14312F'
const TEAL = '#0E9AA7'
const CORAL = '#CF471E'
const SOL = '#FFC76E'

/** Cartão de compartilhamento, 1200×630. */
const OG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9BE0DF"/>
      <stop offset="1" stop-color="#BFECEA"/>
    </linearGradient>
    <radialGradient id="sol" cx="50%" cy="50%">
      <stop offset="0" stop-color="${SOL}" stop-opacity=".9"/>
      <stop offset="1" stop-color="${SOL}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${AREIA}"/>
  <circle cx="1010" cy="120" r="260" fill="url(#sol)"/>
  <path d="M-40 470 Q 300 430 600 470 T 1240 460 L1240 630 L-40 630 Z" fill="url(#mar)" opacity=".9"/>
  <path d="M-40 520 Q 320 486 620 520 T 1240 512 L1240 630 L-40 630 Z" fill="${TEAL}" opacity=".18"/>

  <text x="90" y="150" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34"
        font-weight="700" letter-spacing="6" fill="${TEAL}">BI &amp; B</text>

  <text x="90" y="285" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="82"
        font-weight="800" letter-spacing="-3" fill="${TINTA}">Voo, hotel e roteiro.</text>
  <text x="90" y="378" font-family="Georgia, Times New Roman, serif" font-size="82"
        font-style="italic" fill="${TEAL}">Uma busca só.</text>

  <text x="90" y="452" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="30"
        fill="#4A5F5D">Compare tudo lado a lado. Melhor preço garantido.</text>

  <rect x="90" y="500" width="232" height="62" rx="31" fill="${CORAL}"/>
  <text x="206" y="540" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="24"
        font-weight="700" fill="#fff" text-anchor="middle">Planejar viagem</text>
</svg>`

/** Ícone de toque do iOS, 180×180. */
const TOQUE = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${AREIA}"/>
  <path d="M0 44h64v20H0z" fill="${TEAL}" opacity=".22"/>
  <circle cx="48" cy="17" r="9" fill="${SOL}" opacity=".85"/>
  <text x="32" y="41" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="26"
        font-weight="800" letter-spacing="-1.6" text-anchor="middle" fill="${TINTA}">B<tspan fill="${CORAL}">&amp;</tspan>B</text>
</svg>`

await mkdir(publico, { recursive: true })

await writeFile(resolve(publico, 'og-image.svg'), OG)
await sharp(Buffer.from(OG)).png({ compressionLevel: 9 }).toFile(resolve(publico, 'og-image.png'))
await sharp(Buffer.from(TOQUE)).png({ compressionLevel: 9 }).toFile(resolve(publico, 'apple-touch-icon.png'))

console.log('assets gerados: og-image.png (1200×630), apple-touch-icon.png (180×180)')
