import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '@/components/ui/Botao'
import {
  apagarDados,
  dadosGuardados,
  definirConsentimento,
  reabrirAviso,
  useConsentimento,
} from '@/hooks/useConsentimento'
import css from './AvisoPrivacidade.module.css'

/**
 * Aviso de armazenamento local.
 *
 * Não é banner de cookie — o site não usa cookie nenhum, nem rastreador. O que
 * ele guarda são preferências no `localStorage` do próprio aparelho: favoritos,
 * a viagem montada e o checklist.
 *
 * Pela LGPD isso não exigiria consentimento prévio, já que nada identifica
 * ninguém nem sai do aparelho. O aviso existe porque as outras duas obrigações
 * continuam valendo: informar o que é guardado e permitir apagar. Por isso
 * "recusar" apaga de verdade e interrompe novas gravações, em vez de fechar uma
 * caixa e seguir gravando igual.
 */
export function AvisoPrivacidade() {
  const consentimento = useConsentimento()

  if (consentimento !== 'pendente') return null

  return (
    <aside
      className={css['aviso']}
      role="dialog"
      aria-live="polite"
      aria-labelledby="aviso-privacidade-titulo"
    >
      <p id="aviso-privacidade-titulo" className={css['titulo']}>
        Seus dados ficam no seu aparelho
      </p>
      <p className={css['texto']}>
        A BI&amp;B <span className={css['destaque']}>não usa cookies</span> e não tem rastreador.
        Guardamos favoritos, reservas e preferências no armazenamento local do seu navegador — nada
        é enviado para servidor nenhum. Consultamos previsão do tempo e busca de cidades em serviços
        públicos, sem identificar você.
      </p>

      <div className={css['acoes']}>
        <Botao
          tamanho="sm"
          onClick={() => {
            definirConsentimento('aceito')
          }}
        >
          Entendi
        </Botao>
        <Botao
          tamanho="sm"
          variante="secundario"
          onClick={() => {
            definirConsentimento('recusado')
          }}
        >
          Não guardar nada
        </Botao>
        <Link className={css['link']} to="/privacidade">
          Ler a política
        </Link>
      </div>
    </aside>
  )
}

/**
 * Controle de dados no rodapé.
 *
 * O direito de apagar não vale muito se só aparece uma vez, no primeiro
 * acesso. Aqui ele fica permanente, e mostra exatamente o que existe guardado
 * — não uma descrição do que existiria.
 */
export function GerenciarDados() {
  const consentimento = useConsentimento()
  const [aberto, setAberto] = useState(false)
  const [apagou, setApagou] = useState(false)

  const chaves = aberto ? dadosGuardados() : []

  return (
    <>
      <button
        type="button"
        className={css['gerenciar']}
        aria-expanded={aberto}
        onClick={() => {
          setAberto((v) => !v)
          setApagou(false)
        }}
      >
        Meus dados
      </button>

      {aberto ? (
        <div className={css['painel']}>
          <p className={css['painelTitulo']}>Guardado neste navegador</p>

          {chaves.length > 0 ? (
            <ul className={css['chaves']}>
              {chaves.map((c) => (
                <li key={c.chave} className={css['chave']}>
                  <span>{c.chave}</span>
                  <span>{c.tamanho} caracteres</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={css['vazio']}>
              {apagou ? 'Tudo apagado.' : 'Nada guardado — nem preferências, nem favoritos.'}
            </p>
          )}

          <div className={css['acoes']}>
            {chaves.length > 0 ? (
              <Botao
                tamanho="sm"
                variante="secundario"
                onClick={() => {
                  apagarDados()
                  setApagou(true)
                }}
              >
                Apagar tudo
              </Botao>
            ) : null}

            {consentimento === 'recusado' ? (
              <Botao
                tamanho="sm"
                variante="secundario"
                onClick={() => {
                  definirConsentimento('aceito')
                }}
              >
                Voltar a guardar preferências
              </Botao>
            ) : (
              <Botao
                tamanho="sm"
                variante="secundario"
                onClick={() => {
                  reabrirAviso()
                  setAberto(false)
                }}
              >
                Rever a escolha
              </Botao>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
