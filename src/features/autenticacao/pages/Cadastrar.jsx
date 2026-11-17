import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { Marca } from '../../../components/ui/Marca'
import { useTitulo } from '../../../hooks/useTitulo'

export function Cadastrar() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [papel, setPapel] = useState('solicitante')
  const [erros, setErros] = useState({})

  useTitulo('Criar cadastro')

  function enviar(evento) {
    evento.preventDefault()
    const novosErros = {}
    if (nome.trim().length < 3) novosErros.nome = 'Informe seu nome completo.'
    if (nome.trim().length > 80) novosErros.nome = 'Use um nome com até 80 letras.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      novosErros.email = 'Informe um e-mail válido.'
    }
    if (senha.length < 6) novosErros.senha = 'A senha precisa ter pelo menos 6 caracteres.'
    if (senha !== confirmar) novosErros.confirmar = 'As senhas não são iguais.'
    if (papel !== 'solicitante' && papel !== 'responsavel') {
      novosErros.papel = 'Escolha se você abre ou atende chamados.'
    }
    setErros(novosErros)
  }

  function aoDigitar(definir) {
    return (evento) => {
      definir(evento.target.value)
      setErros({})
    }
  }

  return (
    <main className="auth">
      <section className="auth-cartao">
        <Marca />
        <p className="equipe">Equipe Rocket</p>
        <h1>Criar cadastro</h1>
        <p className="subtitulo">Crie sua conta de acesso.</p>
        <p className="banner" role="status">
          O cadastro não está disponível nesta etapa. O formulário não salvará dados.
        </p>

        <form onSubmit={enviar} noValidate>
          <CampoTexto
            rotulo="Nome completo"
            autoComplete="name"
            value={nome}
            onChange={aoDigitar(setNome)}
            erro={erros.nome}
          />
          <CampoTexto
            rotulo="E-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={aoDigitar(setEmail)}
            erro={erros.email}
          />
          <CampoTexto
            rotulo="Senha"
            type="password"
            autoComplete="new-password"
            value={senha}
            onChange={aoDigitar(setSenha)}
            erro={erros.senha}
            dica="Mínimo de 6 caracteres."
          />
          <CampoTexto
            rotulo="Confirmar senha"
            type="password"
            autoComplete="new-password"
            value={confirmar}
            onChange={aoDigitar(setConfirmar)}
            erro={erros.confirmar}
          />

          <fieldset className="grupo">
            <legend>Como você vai usar o sistema?</legend>
            <div className="opcoes">
              <button
                type="button"
                className={papel === 'solicitante' ? 'opcao ativa' : 'opcao'}
                aria-pressed={papel === 'solicitante'}
                onClick={() => {
                  setPapel('solicitante')
                  setErros({})
                }}
              >
                <strong>Solicitante</strong>
                <span>Abro chamados quando preciso de ajuda.</span>
              </button>
              <button
                type="button"
                className={papel === 'responsavel' ? 'opcao ativa' : 'opcao'}
                aria-pressed={papel === 'responsavel'}
                onClick={() => {
                  setPapel('responsavel')
                  setErros({})
                }}
              >
                <strong>Responsável</strong>
                <span>Atendo chamados no painel da equipe.</span>
              </button>
            </div>
            {erros.papel ? <p className="mensagem-erro">{erros.papel}</p> : null}
          </fieldset>

          <Botao bloco type="submit">
            Criar conta
          </Botao>
        </form>

        <p className="troca-tela">
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </p>
      </section>
    </main>
  )
}
