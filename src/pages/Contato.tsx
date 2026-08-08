import { useId, useState, type FormEvent } from 'react'
import { LayoutSite } from '@/components/site/LayoutSite'
import { Botao } from '@/components/ui/Botao'
import { Reveal } from '@/components/ui/Reveal'
import { useMetaDaPagina } from '@/hooks/useMetaDaPagina'
import css from './Contato.module.css'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITE_MENSAGEM = 1200

const ASSUNTOS = [
  'Dúvida sobre uma reserva',
  'Problema com o site',
  'Melhor preço garantido',
  'Parceria ou fornecedor',
  'Imprensa',
  'Outro assunto',
]

interface Erros {
  nome?: string
  email?: string
  mensagem?: string
}

/**
 * Contato.
 *
 * O formulário valida de verdade e monta um `mailto:` com tudo preenchido —
 * então funciona hoje, sem backend, e o envio real é trocar esta função por um
 * `POST` quando a API existir. A alternativa seria um formulário decorativo,
 * que é pior que não ter formulário.
 */
export function Contato() {
  useMetaDaPagina(
    'Contato',
    'Fale com a BI&B: dúvidas sobre reservas, problemas no site, parcerias e imprensa.',
  )

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [assunto, setAssunto] = useState(ASSUNTOS[0])
  const [mensagem, setMensagem] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviado, setEnviado] = useState(false)
  /** Campo isca: só robô preenche. */
  const [isca, setIsca] = useState('')

  const id = useId()

  function validar(): Erros {
    const novos: Erros = {}
    if (nome.trim().length < 2) novos.nome = 'Escreva seu nome.'
    if (!EMAIL.test(email.trim())) novos.email = 'Esse e-mail não parece completo.'
    if (mensagem.trim().length < 10) novos.mensagem = 'Conte um pouco mais — pelo menos 10 caracteres.'
    return novos
  }

  function aoEnviar(e: FormEvent) {
    e.preventDefault()

    // Isca preenchida: encerra em silêncio, como se tivesse dado certo. Dizer
    // "detectamos um robô" só ensina o robô a passar da próxima vez.
    if (isca) {
      setEnviado(true)
      return
    }

    const novos = validar()
    setErros(novos)
    if (Object.keys(novos).length > 0) {
      // Leva o foco ao primeiro campo com problema, para quem usa teclado não
      // ter de caçar o erro.
      const primeiro = Object.keys(novos)[0]
      document.getElementById(`${id}-${String(primeiro)}`)?.focus()
      return
    }

    const corpo = `${mensagem.trim()}\n\n—\n${nome.trim()}\n${email.trim()}`
    window.location.href = `mailto:oi@bib.com.br?subject=${encodeURIComponent(
      `[${assunto ?? 'Contato'}] ${nome.trim()}`,
    )}&body=${encodeURIComponent(corpo)}`
    setEnviado(true)
  }

  return (
    <LayoutSite>
      <div className={`shell ${css['pagina']}`}>
        <Reveal>
          <p className="eyebrow">BI&amp;B</p>
          <h1 className={css['titulo']}>
            Fale <span className="serif">com a gente.</span>
          </h1>
          <p className={css['chamada']}>
            Dúvida sobre uma reserva, algo quebrado no site ou uma proposta de parceria — respondemos
            em até um dia útil.
          </p>

          <div className={css['canais']}>
            <div className={css['canal']}>
              <span className={css['canalRotulo']}>e-mail</span>
              <a className={css['canalValor']} href="mailto:oi@bib.com.br">
                oi@bib.com.br
              </a>
            </div>
            <div className={css['canal']}>
              <span className={css['canalRotulo']}>imprensa</span>
              <a className={css['canalValor']} href="mailto:imprensa@bib.com.br">
                imprensa@bib.com.br
              </a>
            </div>
            <div className={css['canal']}>
              <span className={css['canalRotulo']}>onde estamos</span>
              <span className={css['canalValor']}>Rio de Janeiro, RJ</span>
            </div>
          </div>
        </Reveal>

        <Reveal atraso={0.08}>
          {enviado ? (
            <div className={css['sucesso']} role="status">
              <span className={css['sucessoTitulo']}>Mensagem pronta para envio</span>
              <p className={css['sucessoTexto']}>
                Abrimos seu programa de e-mail com tudo preenchido. Se nada apareceu, escreva direto
                para <a href="mailto:oi@bib.com.br">oi@bib.com.br</a> — a caixa é a mesma.
              </p>
              <div>
                <Botao
                  variante="secundario"
                  onClick={() => {
                    setEnviado(false)
                  }}
                >
                  Escrever outra mensagem
                </Botao>
              </div>
            </div>
          ) : (
            <form className={css['form']} onSubmit={aoEnviar} noValidate>
              <div className={css['campo']}>
                <label className={css['rotulo']} htmlFor={`${id}-nome`}>
                  Seu nome
                </label>
                <input
                  id={`${id}-nome`}
                  className={css['entrada']}
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (erros.nome) setErros({ ...erros, nome: undefined })
                  }}
                  autoComplete="name"
                  aria-invalid={erros.nome ? 'true' : 'false'}
                  aria-describedby={erros.nome ? `${id}-nome-erro` : undefined}
                />
                {erros.nome ? (
                  <span id={`${id}-nome-erro`} className={css['erro']} role="alert">
                    {erros.nome}
                  </span>
                ) : null}
              </div>

              <div className={css['campo']}>
                <label className={css['rotulo']} htmlFor={`${id}-email`}>
                  Seu e-mail
                </label>
                <input
                  id={`${id}-email`}
                  className={css['entrada']}
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (erros.email) setErros({ ...erros, email: undefined })
                  }}
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  aria-invalid={erros.email ? 'true' : 'false'}
                  aria-describedby={erros.email ? `${id}-email-erro` : undefined}
                />
                {erros.email ? (
                  <span id={`${id}-email-erro`} className={css['erro']} role="alert">
                    {erros.email}
                  </span>
                ) : null}
              </div>

              <div className={css['campo']}>
                <label className={css['rotulo']} htmlFor={`${id}-assunto`}>
                  Assunto
                </label>
                <select
                  id={`${id}-assunto`}
                  className={css['select']}
                  value={assunto}
                  onChange={(e) => {
                    setAssunto(e.target.value)
                  }}
                >
                  {ASSUNTOS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className={css['campo']}>
                <label className={css['rotulo']} htmlFor={`${id}-mensagem`}>
                  Mensagem
                </label>
                <textarea
                  id={`${id}-mensagem`}
                  className={css['area']}
                  value={mensagem}
                  maxLength={LIMITE_MENSAGEM}
                  onChange={(e) => {
                    setMensagem(e.target.value)
                    if (erros.mensagem) setErros({ ...erros, mensagem: undefined })
                  }}
                  aria-invalid={erros.mensagem ? 'true' : 'false'}
                  aria-describedby={erros.mensagem ? `${id}-mensagem-erro` : `${id}-contador`}
                />
                <span id={`${id}-contador`} className={css['contador']}>
                  {mensagem.length} / {LIMITE_MENSAGEM}
                </span>
                {erros.mensagem ? (
                  <span id={`${id}-mensagem-erro`} className={css['erro']} role="alert">
                    {erros.mensagem}
                  </span>
                ) : null}
              </div>

              {/* Isca antirrobô. Fora da ordem de tabulação e escondida do
                  leitor de tela: só um preenchedor automático a encontra. */}
              <div className={css['armadilha']} aria-hidden="true">
                <label htmlFor={`${id}-site`}>Não preencha este campo</label>
                <input
                  id={`${id}-site`}
                  name="site"
                  tabIndex={-1}
                  autoComplete="off"
                  value={isca}
                  onChange={(e) => {
                    setIsca(e.target.value)
                  }}
                />
              </div>

              <Botao type="submit" bloco tamanho="lg">
                Enviar mensagem
              </Botao>

              <p className={css['nota']}>
                Usamos seu e-mail apenas para responder. Nada é guardado em servidor nesta versão —
                veja a <a href="/privacidade">política de privacidade</a>.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </LayoutSite>
  )
}
