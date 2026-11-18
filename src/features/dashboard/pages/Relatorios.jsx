import { useCallback, useMemo, useState } from 'react'
import { CircleCheck, Clock, Ticket } from 'lucide-react'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { formatarData } from '../../../utils/texto'
import { ROTULOS_STATUS } from '../../chamados/dominio'

const PERIODOS = [
  { id: '7', rotulo: '7 dias', dias: 7 },
  { id: '30', rotulo: '30 dias', dias: 30 },
  { id: 'tudo', rotulo: 'Tudo', dias: null },
]

export function Relatorios() {
  const [periodo, setPeriodo] = useState('tudo')
  const carregar = useCallback(() => chamadosApi.listar(), [])
  const { dados: chamados, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Relatórios')

  const escolhido = PERIODOS.find((opcao) => opcao.id === periodo)
  const filtrados = useMemo(() => {
    if (!escolhido?.dias) return chamados || []
    const limite = Date.now() - escolhido.dias * 24 * 60 * 60 * 1000
    return (chamados || []).filter((chamado) => new Date(chamado.createdAt).getTime() >= limite)
  }, [chamados, escolhido])
  const atribuidos = filtrados.filter((chamado) => chamado.tecnicoId || chamado.tecnico?.id).length
  const semResponsavel = filtrados.length - atribuidos
  const encerrados = filtrados.filter((chamado) => ['RESOLVIDO', 'FECHADO'].includes(chamado.status)).length
  const porStatus = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO'].map((status) => ({
    status,
    quantidade: filtrados.filter((chamado) => chamado.status === status).length,
  }))

  return (
    <>
      <header className="cabecalho-pagina">
        <div><span className="sobretitulo">EQUIPE DE SUPORTE</span><h1>Relatórios</h1><p className="subtitulo">Volume e distribuição dos chamados no período selecionado.</p></div>
        <div className="segmentos" role="group" aria-label="Escolher período">
          {PERIODOS.map((opcao) => <button key={opcao.id} type="button" aria-pressed={periodo === opcao.id} className={periodo === opcao.id ? 'segmento ativo' : 'segmento'} onClick={() => setPeriodo(opcao.id)}>{opcao.rotulo}</button>)}
        </div>
      </header>
      <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
      <section className="numeros" aria-label="Resumo dos chamados">
        <article className="numero numero-total"><span className="numero-icone" aria-hidden="true"><Ticket size={19} /></span><div><span className="numero-legenda">Total de chamados</span><strong>{carregando ? '—' : filtrados.length}</strong><span className="numero-nota">{escolhido.dias ? `Últimos ${escolhido.dias} dias` : 'Desde o início'}</span></div></article>
        <article className="numero numero-meus"><span className="numero-icone" aria-hidden="true"><CircleCheck size={19} /></span><div><span className="numero-legenda">Resolvidos ou fechados</span><strong>{carregando ? '—' : encerrados}</strong><span className="numero-nota">No período selecionado</span></div></article>
        <article className="numero numero-aberto"><span className="numero-icone" aria-hidden="true"><Clock size={19} /></span><div><span className="numero-legenda">Sem responsável</span><strong>{carregando ? '—' : semResponsavel}</strong><span className="numero-nota">No período selecionado</span></div></article>
      </section>
      <section className="painel-graficos" aria-label="Distribuição dos chamados">
        <article className="grafico-cartao">
          <div className="grafico-topo"><div><span className="sobretitulo">SITUAÇÃO</span><h2>Chamados por status</h2></div></div>
          {porStatus.map(({ status, quantidade }) => <div className="relatorio-status" key={status}><span>{ROTULOS_STATUS[status]}</span><strong>{carregando ? '—' : quantidade}</strong><progress max={Math.max(filtrados.length, 1)} value={quantidade} aria-label={`${ROTULOS_STATUS[status]}: ${quantidade}`} /></div>)}
        </article>
        <article className="grafico-cartao">
          <div className="grafico-topo"><div><span className="sobretitulo">RESPONSABILIDADE</span><h2>Chamados atribuídos</h2></div></div>
          <dl className="relatorio-status">
            <div><dt>Com responsável</dt><dd>{carregando ? '—' : atribuidos}</dd></div>
            <div><dt>Sem responsável</dt><dd>{carregando ? '—' : semResponsavel}</dd></div>
            <div><dt>Última atualização registrada</dt><dd>{filtrados.length ? formatarData(filtrados[0].updatedAt || filtrados[0].createdAt) : '—'}</dd></div>
          </dl>
        </article>
      </section>
    </>
  )
}
