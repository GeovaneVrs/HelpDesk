import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useTitulo } from '../../../hooks/useTitulo'
import { usuariosApi } from '../../../services/usuarios'
import { mensagemDeErro } from '../../../services/api'
import { nomePapel } from '../../chamados/dominio'

export function Configuracoes() {
  const { usuario, atualizarUsuario } = useAutenticacao()
  const [nome, setNome] = useState(usuario.name || '')
  const [email, setEmail] = useState(usuario.email || '')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)
  useTitulo('Configurações')

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSucesso('')
    if (nome.trim().length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Informe um nome com pelo menos 3 caracteres e um e-mail válido.')
      return
    }

    setSalvando(true)
    try {
      const atualizado = await usuariosApi.atualizarProprioPerfil({ name: nome.trim(), email: email.trim() })
      atualizarUsuario(atualizado)
      setNome(atualizado.name)
      setEmail(atualizado.email)
      setSucesso('Perfil atualizado.')
    } catch (falha) {
      setErro(mensagemDeErro(falha))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="config">
      <header className="cabecalho-pagina">
        <div><span className="sobretitulo">SUA CONTA</span><h1>Configurações</h1><p className="subtitulo">Seus dados pessoais e as informações da sua conta.</p></div>
      </header>
      <form className="novo-cartao config-cartao" onSubmit={salvar}>
        <div className="config-cabeca"><h2>Dados pessoais</h2><p className="subtitulo">Como você aparece nos chamados e como entra no sistema.</p></div>
        {erro ? <p className="mensagem-erro" role="alert">{erro}</p> : null}
        {sucesso ? <p className="mensagem-sucesso" role="status">{sucesso}</p> : null}
        <CampoTexto rotulo="Nome completo" autoComplete="name" maxLength={80} value={nome} onChange={(evento) => setNome(evento.target.value)} />
        <CampoTexto rotulo="E-mail" type="email" autoComplete="email" value={email} onChange={(evento) => setEmail(evento.target.value)} dica="É com este e-mail que você entra no sistema." />
        <div className="novo-acoes">
          <Botao para="/alterar-senha" variante="secundario">Alterar senha</Botao>
          <Botao type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar alterações'}</Botao>
        </div>
      </form>
      <section className="novo-cartao config-cartao" aria-labelledby="titulo-empresa">
        <div className="config-cabeca">
          <h2 id="titulo-empresa">Dados da conta</h2>
          <p className="config-trava"><Lock size={14} strokeWidth={2} aria-hidden="true" /> Somente a administração pode alterar o tipo de conta.</p>
        </div>
        <div className="config-grade">
          <CampoTexto rotulo="Tipo de conta" value={nomePapel(usuario.role)} readOnly />
          <CampoTexto rotulo="Cargo" value={usuario.ocupacao || 'Não informado'} readOnly />
          <CampoTexto rotulo="Departamento" value={usuario.departamentoNome || 'Não informado'} readOnly />
        </div>
      </section>
    </div>
  )
}
