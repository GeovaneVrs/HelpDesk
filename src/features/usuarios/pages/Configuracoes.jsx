import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { useTitulo } from '../../../hooks/useTitulo'

export function Configuracoes() {
  useTitulo('Configurações')

  return (
    <div className="config">
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">SUA CONTA</span>
          <h1>Configurações</h1>
          <p className="subtitulo">Seus dados pessoais e as informações da sua conta.</p>
        </div>
      </header>

      <CartaoDadosPessoais />
      <CartaoDadosEmpresa />
    </div>
  )
}

function CartaoDadosPessoais() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [erros, setErros] = useState({})

  function salvar(evento) {
    evento.preventDefault()
    const novosErros = {}
    if (nome.trim().length < 3) novosErros.nome = 'Informe seu nome completo.'
    if (nome.trim().length > 80) novosErros.nome = 'Use um nome com até 80 letras.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      novosErros.email = 'Informe um e-mail válido.'
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
    <form className="novo-cartao config-cartao" onSubmit={salvar} noValidate>
      <div className="config-cabeca">
        <h2>Dados Pessoais</h2>
        <p className="subtitulo">Como você aparece nos chamados e como entra no sistema.</p>
      </div>

      <p className="banner" role="status">
        O perfil não está conectado a uma fonte de dados. As alterações não serão salvas.
      </p>

      <CampoTexto
        rotulo="Nome completo"
        autoComplete="name"
        maxLength={80}
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
        dica="É com este e-mail que você entra no sistema."
      />

      <div className="novo-acoes">
        <Botao type="submit">Salvar alterações</Botao>
      </div>
    </form>
  )
}

function CartaoDadosEmpresa() {
  return (
    <section className="novo-cartao config-cartao" aria-labelledby="titulo-empresa">
      <div className="config-cabeca">
        <h2 id="titulo-empresa">Dados da empresa</h2>
        <p className="config-trava">
          <Lock size={14} strokeWidth={2} aria-hidden="true" />
          Somente a administração pode alterar estes dados.
        </p>
      </div>

      <div className="config-grade">
        <CampoTexto rotulo="Tipo de conta" value="" placeholder="Indisponível nesta etapa" readOnly />
        <CampoTexto rotulo="Cargo" value="" placeholder="Indisponível nesta etapa" readOnly />
        <CampoTexto rotulo="Departamento" value="" placeholder="Indisponível nesta etapa" readOnly />
      </div>
    </section>
  )
}
