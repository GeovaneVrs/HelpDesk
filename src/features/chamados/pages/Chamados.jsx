import { useCallback, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { formatarData } from '../../../utils/texto'
import { nomeStatus } from '../dominio'
import { Fila } from './Fila'

export function PaginaChamados() {
  const { usuario } = useAutenticacao()
  return usuario.role === 'USER' ? <Chamados /> : <Fila />
}

function CartaoChamadoApi({ chamado }) {
  return (
    <article className="chamado">
      <div className="chamado-topo">
        <h2>{chamado.titulo}</h2>
        <span className={`selo selo-${chamado.status.toLowerCase()}`}>{nomeStatus(chamado.status)}</span>
      </div>
      <p className="chamado-descricao">{chamado.descricao}</p>
      <ul className="chamado-detalhes">
        <li>{formatarData(chamado.createdAt)}</li>
        <li>{chamado.departamentoNome || 'Sem departamento'}</li>
        <li>{chamado.tecnicoNome ? `Técnico: ${chamado.tecnicoNome}` : 'Sem técnico'}</li>
      </ul>
      <div className="chamado-acao">
        <Botao para={`/chamados/${chamado.id}`}>Ver detalhes</Botao>
      </div>
    </article>
  )
}

export function Chamados() {
  const [busca, setBusca] = useState('')
  const carregar = useCallback(() => chamadosApi.listarMeus(), [])
  const { dados: chamados, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Chamados')

  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  const visiveis = (chamados || []).filter((chamado) =>
    `${chamado.titulo} ${chamado.descricao}`.toLocaleLowerCase('pt-BR').includes(termo),
  )
  const aguardando = (chamados || []).filter((chamado) => chamado.status === 'ABERTO').length
  const emAtendimento = (chamados || []).filter((chamado) => chamado.status === 'EM_ANDAMENTO').length

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">ÁREA DO SOLICITANTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Acompanhe suas solicitações e veja o andamento do suporte.</p>
        </div>
        <Botao para="/chamados/novo"><span aria-hidden="true">＋</span> Novo chamado</Botao>
      </header>

      <section className="numeros numeros-solicitante" aria-label="Resumo dos seus chamados">
        <article className="numero numero-total"><span className="numero-icone" aria-hidden="true">▤</span><div><span className="numero-legenda">Total de solicitações</span><strong>{chamados?.length ?? '—'}</strong><span className="numero-nota">Registradas por você</span></div></article>
        <article className="numero numero-aberto"><span className="numero-icone" aria-hidden="true">◷</span><div><span className="numero-legenda">Aguardando equipe</span><strong>{carregando ? '—' : aguardando}</strong><span className="numero-nota">Status aberto</span></div></article>
        <article className="numero numero-meus"><span className="numero-icone" aria-hidden="true">✓</span><div><span className="numero-legenda">Em atendimento</span><strong>{carregando ? '—' : emAtendimento}</strong><span className="numero-nota">Em andamento</span></div></article>
      </section>

      <section className="chamados-secao" aria-labelledby="titulo-meus-chamados">
        <div className="secao-cabecalho"><div><span className="sobretitulo">ACOMPANHAMENTO</span><h2 id="titulo-meus-chamados">Suas solicitações</h2></div></div>
        <div className="ferramentas">
          <label className="busca"><span className="oculto">Buscar por título</span><span className="busca-icone" aria-hidden="true">⌕</span><input className="entrada" type="search" placeholder="Buscar chamado" value={busca} onChange={(evento) => setBusca(evento.target.value)} /></label>
          <span className="resultado-contagem">{visiveis.length} {visiveis.length === 1 ? 'chamado' : 'chamados'}</span>
        </div>
        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && visiveis.length === 0 ? (
          <EstadoVazio titulo={termo ? 'Nenhum chamado encontrado' : 'Você ainda não abriu chamados'} texto={termo ? 'Tente outro termo de busca.' : 'Registre sua primeira solicitação para acompanhar o atendimento.'} acao={!termo ? <Botao para="/chamados/novo">Abrir chamado</Botao> : null} />
        ) : null}
        {!erro && visiveis.length > 0 ? <div className="lista">{visiveis.map((chamado) => <CartaoChamadoApi key={chamado.id} chamado={chamado} />)}</div> : null}
      </section>
    </>
  )
}
