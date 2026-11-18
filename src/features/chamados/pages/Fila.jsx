import { useCallback, useMemo, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { formatarData } from '../../../utils/texto'
import { nomeStatus } from '../dominio'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'livres', rotulo: 'Sem responsável' },
  { id: 'meus', rotulo: 'Comigo' },
]

function responsavelDoChamado(chamado) {
  return chamado.tecnicoId ?? chamado.tecnico?.id ?? chamado.tecnico?.usuarioId ?? null
}

export function Fila() {
  const { usuario } = useAutenticacao()
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const carregar = useCallback(() => chamadosApi.listar(), [])
  const { dados: chamados, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Chamados')

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')
    return (chamados || []).filter((chamado) => {
      const responsavelId = responsavelDoChamado(chamado)
      const correspondeFiltro =
        filtro === 'livres' ? !responsavelId
          : filtro === 'meus' ? String(responsavelId) === String(usuario.id)
            : true
      const texto = `${chamado.titulo} ${chamado.descricao} ${chamado.solicitanteNome || ''}`
        .toLocaleLowerCase('pt-BR')
      return correspondeFiltro && texto.includes(termo)
    })
  }, [busca, chamados, filtro, usuario.id])

  const contagens = {
    todos: chamados?.length ?? 0,
    livres: (chamados || []).filter((chamado) => !responsavelDoChamado(chamado)).length,
    meus: (chamados || []).filter((chamado) => String(responsavelDoChamado(chamado)) === String(usuario.id)).length,
  }

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Acompanhe a fila e abra a conversa com o solicitante.</p>
        </div>
      </header>

      <section className="chamados-secao" aria-labelledby="titulo-fila">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">FILA</span>
            <h2 id="titulo-fila">Solicitações</h2>
            <p className="subtitulo">Chamados e atendimentos da equipe.</p>
          </div>
        </div>
        <div className="ferramentas painel-ferramentas">
          <div className="segmentos" role="group" aria-label="Filtrar chamados">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={filtro === opcao.id}
                className={filtro === opcao.id ? 'segmento ativo' : 'segmento'}
                onClick={() => setFiltro(opcao.id)}
              >
                {opcao.rotulo}
                <span className="filtro-contagem">{carregando ? '—' : contagens[opcao.id]}</span>
              </button>
            ))}
          </div>
          <label className="busca">
            <span className="oculto">Buscar chamado ou solicitante</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar chamado ou solicitante"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && visiveis.length === 0 ? (
          <EstadoVazio
            titulo={busca ? 'Nenhum chamado encontrado' : 'Nenhum chamado nesta fila'}
            texto={busca ? 'Tente outro termo de busca.' : 'Novos chamados aparecerão aqui quando forem registrados.'}
          />
        ) : null}
        {!erro && visiveis.length > 0 ? (
          <div className="lista">
            {visiveis.map((chamado) => (
              <article className="chamado" key={chamado.id}>
                <div className="chamado-topo">
                  <h2>{chamado.titulo}</h2>
                  <span className={`selo selo-${chamado.status.toLowerCase()}`}>{nomeStatus(chamado.status)}</span>
                </div>
                <p className="chamado-descricao">{chamado.descricao}</p>
                <ul className="chamado-detalhes">
                  <li>{formatarData(chamado.createdAt)}</li>
                  <li>{chamado.solicitanteNome || 'Solicitante'}</li>
                  <li>{chamado.tecnicoNome || (responsavelDoChamado(chamado) ? 'Atribuído' : 'Sem responsável')}</li>
                </ul>
                <div className="chamado-acao">
                  <Botao para={`/chamados/${chamado.id}`}>Ver detalhes</Botao>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
