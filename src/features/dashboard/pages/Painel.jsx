import { useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useTitulo } from '../../../hooks/useTitulo'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'livres', rotulo: 'Sem responsável' },
  { id: 'meus', rotulo: 'Comigo' },
]

export function Painel() {
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')

  useTitulo('Visão geral')

  const termo = busca.trim().toLowerCase()
  const contagens = {
    todos: '—',
    livres: '—',
    meus: '—',
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
          <strong>—</strong>
          <span className="resumo-detalhe">Dados indisponíveis</span>
        </article>
        <article className="resumo-item">
          <span className="resumo-rotulo">Aguardando responsável</span>
          <strong>—</strong>
          <span className="resumo-detalhe">Dados indisponíveis</span>
        </article>
        <article className="resumo-item">
          <span className="resumo-rotulo">Atribuídos a mim</span>
          <strong>—</strong>
          <span className="resumo-detalhe">Dados indisponíveis</span>
        </article>
      </section>

      <section className="fila-painel" aria-labelledby="titulo-fila">
        <header className="fila-cabecalho">
          <div>
            <h2 id="titulo-fila">Fila de chamados</h2>
            <p>Solicitações mais recentes primeiro</p>
          </div>
          <span className="fila-total">Dados indisponíveis</span>
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

        <EstadoVazio
          titulo="Fila indisponível"
          texto={termo ? 'Não há dados reais para corresponder à busca.' : 'Os chamados serão listados quando houver uma fonte de dados real.'}
        />
      </section>
    </div>
  )
}
