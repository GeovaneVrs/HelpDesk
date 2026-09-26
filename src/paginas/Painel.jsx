import { useState } from 'react'
import { Botao } from '../componentes/Botao'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { useSessao } from '../contexto/Sessao'
import { assumirChamado, listarChamados } from '../servicos/chamados'
import { formatarData, iniciais } from '../uteis/texto'
import { useTitulo } from '../uteis/useTitulo'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'livres', rotulo: 'Sem responsável' },
  { id: 'meus', rotulo: 'Comigo' },
]

export function Painel() {
  const { usuario } = useSessao()
  const [chamados, setChamados] = useState(() => listarChamados())
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  useTitulo('Visão geral')

  const termo = busca.trim().toLowerCase()
  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtro === 'livres' && chamado.responsavelId) return false
    if (filtro === 'meus' && chamado.responsavelId !== usuario.id) return false

    const textoChamado = `${chamado.titulo} ${chamado.autorNome}`.toLowerCase()
    return textoChamado.includes(termo)
  })

  const semResponsavel = chamados.filter((chamado) => !chamado.responsavelId).length
  const meusChamados = chamados.filter((chamado) => chamado.responsavelId === usuario.id).length
  const contagens = {
    todos: chamados.length,
    livres: semResponsavel,
    meus: meusChamados,
  }

  function assumir(id) {
    const resultado = assumirChamado(id, usuario)
    setChamados(listarChamados())
    setErro(resultado.ok ? '' : resultado.erro)
  }

  function responsavelDoChamado(chamado) {
    if (!chamado.responsavelId) return 'Disponível para atendimento'
    if (chamado.responsavelId === usuario.id) return 'Atribuído a você'
    return chamado.responsavelNome || 'Responsável definido'
  }

  return (
    <div className="dashboard">
      <header className="dashboard-cabecalho">
        <div>
          <span className="sobretitulo">CENTRAL DE ATENDIMENTO</span>
          <h1>Visão geral</h1>
          <p className="subtitulo">Fila e atendimentos da equipe em um só lugar.</p>
        </div>
        <Botao para="/chamados">Ver todos os chamados <span aria-hidden="true">↗</span></Botao>
      </header>

      <section className="dashboard-resumo" aria-label="Resumo dos chamados">
        <article className="resumo-item">
          <span className="resumo-rotulo">Chamados na fila</span>
          <strong>{chamados.length}</strong>
          <span className="resumo-detalhe">Total registrado</span>
        </article>
        <article className="resumo-item">
          <span className="resumo-rotulo">Aguardando responsável</span>
          <strong>{semResponsavel}</strong>
          <span className="resumo-detalhe">Precisam de atendimento</span>
        </article>
        <article className="resumo-item">
          <span className="resumo-rotulo">Atribuídos a mim</span>
          <strong>{meusChamados}</strong>
          <span className="resumo-detalhe">Sob sua responsabilidade</span>
        </article>
      </section>

      <section className="fila-painel" aria-labelledby="titulo-fila">
        <header className="fila-cabecalho">
          <div>
            <h2 id="titulo-fila">Fila de chamados</h2>
            <p>Solicitações mais recentes primeiro</p>
          </div>
          <span className="fila-total">{chamadosFiltrados.length} {chamadosFiltrados.length === 1 ? 'chamado' : 'chamados'}</span>
        </header>

        <div className="fila-ferramentas">
          <div className="fila-filtros" role="group" aria-label="Filtrar chamados">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={filtro === opcao.id}
                className={filtro === opcao.id ? 'fila-filtro ativo' : 'fila-filtro'}
                onClick={() => setFiltro(opcao.id)}
              >
                {opcao.rotulo}
                <span>{contagens[opcao.id]}</span>
              </button>
            ))}
          </div>
          <label className="busca fila-busca">
            <span className="oculto">Buscar por chamado ou solicitante</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar chamados"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        {erro ? <p className="banner" role="alert">{erro}</p> : null}
        {chamadosFiltrados.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum chamado encontrado"
            texto={termo ? 'Tente outro termo ou escolha um filtro diferente.' : 'Não há chamados nesta fila por enquanto.'}
          />
        ) : (
          <div className="fila-lista">
            {chamadosFiltrados.map((chamado) => (
              <article className="fila-item" key={chamado.id}>
                <div className="fila-conteudo">
                  <div className="fila-titulo-linha">
                    <h3>{chamado.titulo}</h3>
                    <span className="fila-status">{chamado.status}</span>
                  </div>
                  <p className="fila-descricao">{chamado.descricao}</p>
                  <div className="fila-metadados">
                    <span className="solicitante-avatar" aria-hidden="true">{iniciais(chamado.autorNome)}</span>
                    <span>{chamado.autorNome || 'Solicitante'}</span>
                    <span className="metadado-separador" aria-hidden="true">·</span>
                    <time dateTime={chamado.criadoEm}>{formatarData(chamado.criadoEm)}</time>
                  </div>
                </div>
                <div className="fila-responsavel">
                  <span className={chamado.responsavelId ? 'responsavel-texto' : 'responsavel-texto sem-responsavel'}>
                    {responsavelDoChamado(chamado)}
                  </span>
                  {!chamado.responsavelId ? (
                    <Botao type="button" onClick={() => assumir(chamado.id)}>Assumir</Botao>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
