import { useCallback, useMemo, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { formatarData } from '../../../utils/texto'
import { nomeStatus } from '../../chamados/dominio'

export function Painel() {
  const { usuario } = useAutenticacao()
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const carregar = useCallback(() => chamadosApi.listar(), [])
  const { dados: chamados, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Visão geral')

  const contagens = useMemo(() => ({
    todos: chamados?.length ?? 0,
    livres: (chamados || []).filter((chamado) => !chamado.tecnicoId && !chamado.tecnico?.id).length,
    meus: (chamados || []).filter((chamado) => String(chamado.tecnicoId || chamado.tecnico?.id) === String(usuario.id)).length,
  }), [chamados, usuario.id])
  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  const visiveis = (chamados || [])
    .filter((chamado) => {
      if (filtro === 'livres' && (chamado.tecnicoId || chamado.tecnico?.id)) return false
      if (filtro === 'meus' && String(chamado.tecnicoId || chamado.tecnico?.id) !== String(usuario.id)) return false
      return `${chamado.titulo} ${chamado.solicitanteNome || ''}`.toLocaleLowerCase('pt-BR').includes(termo)
    })
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
  const abertos = (chamados || []).filter((chamado) => chamado.status === 'ABERTO').length
  return (
    <div className="dashboard">
      <header className="dashboard-cabecalho">
        <div><span className="sobretitulo">CENTRAL DE ATENDIMENTO</span><h1>Visão geral</h1><p className="subtitulo">Fila e atendimentos da equipe em um só lugar.</p></div>
        <Botao para="/chamados">Ver todos os chamados <span aria-hidden="true">↗</span></Botao>
      </header>
      <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
      <section className="dashboard-resumo" aria-label="Resumo dos chamados">
        <article className="resumo-item"><span className="resumo-rotulo">Chamados na fila</span><strong>{carregando ? '—' : chamados?.length ?? 0}</strong><span className="resumo-detalhe">Total de registros</span></article>
        <article className="resumo-item"><span className="resumo-rotulo">Aguardando responsável</span><strong>{carregando ? '—' : abertos}</strong><span className="resumo-detalhe">Status aberto</span></article>
        <article className="resumo-item"><span className="resumo-rotulo">Atribuídos a mim</span><strong>{carregando ? '—' : contagens.meus}</strong><span className="resumo-detalhe">Chamados sob sua responsabilidade</span></article>
      </section>
      <section className="fila-painel" aria-labelledby="titulo-fila">
        <header className="fila-cabecalho"><div><h2 id="titulo-fila">Fila de chamados</h2><p>Solicitações mais recentes primeiro</p></div><span className="fila-total">{carregando ? '—' : visiveis.length} exibidos</span></header>
        <div className="fila-ferramentas">
          <div className="fila-filtros" role="group" aria-label="Filtrar chamados">
            {[['todos', 'Todos'], ['livres', 'Sem responsável'], ['meus', 'Comigo']].map(([id, rotulo]) => (
              <button key={id} type="button" aria-pressed={filtro === id} className={filtro === id ? 'fila-filtro ativo' : 'fila-filtro'} onClick={() => setFiltro(id)}>{rotulo}<span>{contagens[id]}</span></button>
            ))}
          </div>
          <label className="busca fila-busca"><span className="oculto">Buscar por chamado ou solicitante</span><span className="busca-icone" aria-hidden="true">⌕</span><input className="entrada" type="search" placeholder="Buscar chamados" value={busca} onChange={(evento) => setBusca(evento.target.value)} /></label>
        </div>
        {!carregando && !erro && visiveis.length === 0 ? <EstadoVazio titulo="Nenhum chamado encontrado" texto="Ajuste os filtros ou aguarde novas solicitações." /> : null}
        {!erro && visiveis.length > 0 ? <ul className="historico-lista">{visiveis.map((chamado) => (
          <li key={chamado.id}>
            <div className="historico-texto"><strong>{chamado.titulo}</strong><span>{formatarData(chamado.createdAt)} · {chamado.solicitanteNome || 'Solicitante'}</span></div>
            <span className={`selo selo-${chamado.status.toLowerCase()}`}>{nomeStatus(chamado.status)}</span>
            <Botao para={`/chamados/${chamado.id}`} variante="texto">Abrir chamado</Botao>
          </li>
        ))}</ul> : null}
      </section>
    </div>
  )
}
