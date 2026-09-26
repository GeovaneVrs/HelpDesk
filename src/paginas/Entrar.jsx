import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Botao } from '../componentes/Botao'
import { CampoTexto } from '../componentes/CampoTexto'
import { Marca } from '../componentes/Marca'
import { useSessao } from '../contexto/Sessao'
import { restaurarExemplo } from '../dados/armazenamento'
import { useTitulo } from '../uteis/useTitulo'

const EXEMPLOS = [
  { email: 'ana@empresa.com', rotulo: 'Entrar como Ana (solicitante)' },
  { email: 'carlos@empresa.com', rotulo: 'Entrar como Carlos (responsável)' },
]

export function Entrar() {
  const { usuario, entrar } = useSessao()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [aviso, setAviso] = useState('')

  useTitulo('Entrar')

  if (usuario) {
    const destino = usuario.papel === 'responsavel' ? '/painel' : '/chamados'
    return <Navigate to={destino} replace />
  }

  function enviar(evento) {
    evento.preventDefault()
    setAviso('')
    const resultado = entrar(email, senha)
    if (!resultado.ok) setErros(resultado.erros)
  }

  function entrarComo(emailExemplo) {
    setEmail(emailExemplo)
    setSenha('123456')
    setAviso('')
    const resultado = entrar(emailExemplo, '123456')
    if (!resultado.ok) setErros(resultado.erros)
  }

  function restaurar() {
    const confirmou = window.confirm(
      'Isso apaga os cadastros deste navegador e volta aos dados de exemplo. Continuar?',
    )
    if (!confirmou) return
    restaurarExemplo()
    setErros({})
    setAviso('Dados de exemplo restaurados. Já pode entrar com Ana ou Carlos.')
  }

  return (
    <main className="auth">
      <section className="auth-cartao">
        <Marca />
        <p className="equipe">Equipe Rocket</p>
        <h1>Entrar</h1>
        <p className="subtitulo">Use seu e-mail e senha para ver os chamados.</p>

        {erros.geral ? (
          <p className="banner" role="alert">
            {erros.geral}
          </p>
        ) : null}
        {aviso ? (
          <p className="banner banner-ok" role="status">
            {aviso}
          </p>
        ) : null}

        <form onSubmit={enviar} noValidate>
          <CampoTexto
            rotulo="E-mail"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(evento) => {
              setEmail(evento.target.value)
              setErros({})
            }}
            erro={erros.email}
          />
          <CampoTexto
            rotulo="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(evento) => {
              setSenha(evento.target.value)
              setErros({})
            }}
            erro={erros.senha}
          />
          <Botao bloco type="submit">
            Entrar
          </Botao>
        </form>

        <div className="divisor">
          <span>ou experimente</span>
        </div>

        <div className="exemplos">
          {EXEMPLOS.map((exemplo) => (
            <Botao
              key={exemplo.email}
              type="button"
              variante="secundario"
              bloco
              onClick={() => entrarComo(exemplo.email)}
            >
              {exemplo.rotulo}
            </Botao>
          ))}
        </div>
        <p className="dica-exemplo">Senha das contas de exemplo: 123456</p>

        <p className="troca-tela">
          Não tem conta? <Link to="/cadastrar">Criar cadastro</Link>
        </p>
        <button type="button" className="link-discreto" onClick={restaurar}>
          Restaurar dados de exemplo
        </button>
      </section>
    </main>
  )
}
