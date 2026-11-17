import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { Marca } from '../../../components/ui/Marca'
import { useTitulo } from '../../../hooks/useTitulo'

export function Entrar() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})

  useTitulo('Entrar')

  function enviar(evento) {
    evento.preventDefault()
    const novosErros = {}
    if (!email.trim()) novosErros.email = 'Informe o e-mail.'
    if (!senha) novosErros.senha = 'Informe a senha.'
    setErros(novosErros)
  }

  return (
    <main className="auth">
      <section className="auth-cartao">
        <Marca />
        <p className="equipe">Equipe Rocket</p>
        <h1>Entrar</h1>
        <p className="subtitulo">Use seu e-mail e senha para ver os chamados.</p>
        <p className="banner" role="status">
          A autenticação não está disponível nesta etapa. O formulário não enviará dados.
        </p>

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

        <p className="troca-tela">
          Não tem conta? <Link to="/cadastrar">Criar cadastro</Link>
        </p>
      </section>
    </main>
  )
}
