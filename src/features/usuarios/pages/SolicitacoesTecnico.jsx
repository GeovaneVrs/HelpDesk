import { useCallback, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { solicitacoesTecnicoApi } from '../../../services/solicitacoesTecnico'
import { mensagemDeErro } from '../../../services/api'
import { formatarData } from '../../../utils/texto'

export function SolicitacoesTecnico() {
  const { usuario } = useAutenticacao()
  const [erroAcao, setErroAcao] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [motivos, setMotivos] = useState({})
  const [executando, setExecutando] = useState(false)
  const administrar = usuario.role === 'ADMIN'
  const carregar = useCallback(
    () => administrar ? solicitacoesTecnicoApi.listar() : solicitacoesTecnicoApi.listarMinhas(),
    [administrar],
  )
  const { dados: solicitacoes, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Solicitações para técnico')

  async function executar(acao, mensagem) {
    setErroAcao('')
    setSucesso('')
    setExecutando(true)
    try {
      await acao()
      await recarregar()
      setSucesso(mensagem)
    } catch (falha) {
      setErroAcao(mensagemDeErro(falha))
    } finally {
      setExecutando(false)
    }
  }

  return (
    <>
      <header className="cabecalho-pagina"><div><span className="sobretitulo">ACESSO À EQUIPE</span><h1>Solicitações para técnico</h1><p className="subtitulo">{administrar ? 'Analise solicitações de acesso ao perfil técnico.' : 'Solicite acesso ao perfil técnico e acompanhe a decisão.'}</p></div></header>
      {erroAcao ? <p className="mensagem-erro" role="alert">{erroAcao}</p> : null}
      {sucesso ? <p className="mensagem-sucesso" role="status">{sucesso}</p> : null}
      {!administrar && usuario.role === 'USER' ? (
        <section className="novo-cartao config-cartao">
          <h2>Solicitar acesso técnico</h2>
          <p>Envie uma solicitação para que a administração avalie a alteração do seu perfil.</p>
          <Botao type="button" disabled={executando} onClick={() => executar(() => solicitacoesTecnicoApi.solicitar(), 'Solicitação enviada.')}>Enviar solicitação</Botao>
        </section>
      ) : null}
      <section className="chamados-secao">
        <h2>{administrar ? 'Solicitações recebidas' : 'Suas solicitações'}</h2>
        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && (!solicitacoes || solicitacoes.length === 0) ? <EstadoVazio titulo="Nenhuma solicitação" texto="Quando houver solicitações, elas aparecerão nesta lista." /> : null}
        {solicitacoes?.length > 0 ? <div className="lista">{solicitacoes.map((solicitacao) => (
          <article className="chamado" key={solicitacao.id}>
            <div className="chamado-topo"><h3>{solicitacao.usuarioNome || solicitacao.name || 'Solicitação de acesso técnico'}</h3><span className="selo">{solicitacao.status}</span></div>
            <p>{solicitacao.observacao || solicitacao.motivo || 'Solicitação para habilitar o perfil de técnico.'}</p>
            <ul className="chamado-detalhes"><li>{formatarData(solicitacao.createdAt)}</li><li>{solicitacao.email || ''}</li></ul>
            {administrar && solicitacao.status === 'PENDENTE' ? (
              <div className="novo-acoes">
                <CampoTexto rotulo="Motivo da rejeição" value={motivos[solicitacao.id] || ''} onChange={(evento) => setMotivos((atuais) => ({ ...atuais, [solicitacao.id]: evento.target.value }))} />
                <Botao type="button" disabled={executando} onClick={() => executar(() => solicitacoesTecnicoApi.aprovar(solicitacao.id), 'Solicitação aprovada.')}>Aprovar</Botao>
                <Botao type="button" variante="secundario" disabled={executando || !motivos[solicitacao.id]?.trim()} onClick={() => executar(() => solicitacoesTecnicoApi.rejeitar(solicitacao.id, motivos[solicitacao.id].trim()), 'Solicitação rejeitada.')}>Rejeitar</Botao>
              </div>
            ) : null}
          </article>
        ))}</div> : null}
      </section>
    </>
  )
}
