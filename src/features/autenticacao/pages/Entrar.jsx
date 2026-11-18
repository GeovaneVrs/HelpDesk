import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { Marca } from '../../../components/ui/Marca'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { mensagemDeErro } from '../../../services/api'
import { useTitulo } from '../../../hooks/useTitulo'

function destinoDoPapel(role) {
  return role === 'USER' ? '/chamados' : '/painel'
}

export function Entrar() {
  const { usuario, estado, entrar } = useAutenticacao()
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  useTitulo('Entrar')

  if (usuario && estado === 'autenticado') {
    return <Navigate to={destinoDoPapel(usuario.role)} replace />
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const autenticado = await entrar(email.trim(), senha)
      navegar(destinoDoPapel(autenticado.role), { replace: true })
    } catch (erroLogin) {
      setErro(mensagemDeErro(erroLogin))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="auth">
      <section className="auth-cartao">
        <Marca />
        <p className="equipe">Equipe Rocket</p>
        <h1>Entrar</h1>
        <p className="subtitulo">Use seu e-mail e senha para acessar o HelpDesk.</p>

        {erro ? <p className="banner" role="alert">{erro}</p> : null}

        <form onSubmit={enviar} noValidate>
          <CampoTexto
            rotulo="E-mail"
            type="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
          <CampoTexto
            rotulo="Senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
          <Botao bloco type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Botao>
        </form>

        <p className="troca-tela">
          Não tem conta? <Link to="/cadastrar">Criar cadastro</Link>
        </p>
      </section>
    </main>
  )
}
