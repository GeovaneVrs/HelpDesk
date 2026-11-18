import { useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { useTitulo } from '../../../hooks/useTitulo'
import { usuariosApi } from '../../../services/usuarios'
import { mensagemDeErro } from '../../../services/api'

export function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)
  useTitulo('Alterar senha')

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSucesso('')
    if (novaSenha.length < 8) {
      setErro('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (novaSenha !== confirmacao) {
      setErro('A confirmação não corresponde à nova senha.')
      return
    }

    setSalvando(true)
    try {
      await usuariosApi.alterarPropriaSenha({ senhaAtual, novaSenha })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmacao('')
      setSucesso('Senha alterada com sucesso.')
    } catch (falha) {
      setErro(mensagemDeErro(falha))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <section className="novo">
      <Botao para="/configuracoes" variante="texto">← Configurações</Botao>
      <form className="novo-cartao config-cartao" onSubmit={salvar}>
        <span className="sobretitulo">SEGURANÇA</span>
        <h1>Alterar senha</h1>
        {erro ? <p className="mensagem-erro" role="alert">{erro}</p> : null}
        {sucesso ? <p className="mensagem-sucesso" role="status">{sucesso}</p> : null}
        <CampoTexto rotulo="Senha atual" type="password" autoComplete="current-password" value={senhaAtual} onChange={(evento) => setSenhaAtual(evento.target.value)} required />
        <CampoTexto rotulo="Nova senha" type="password" autoComplete="new-password" value={novaSenha} onChange={(evento) => setNovaSenha(evento.target.value)} required />
        <CampoTexto rotulo="Confirmar nova senha" type="password" autoComplete="new-password" value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} required />
        <div className="novo-acoes"><Botao type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Alterar senha'}</Botao></div>
      </form>
    </section>
  )
}
