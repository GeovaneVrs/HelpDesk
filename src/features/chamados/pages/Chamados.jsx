import { useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useTitulo } from '../../../hooks/useTitulo'

export function PaginaChamados() {
  return <Chamados />
}

export function Chamados() {
  const [busca, setBusca] = useState('')
  useTitulo('Chamados')

  const termo = busca.trim().toLowerCase()
  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">ÁREA DO SOLICITANTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Acompanhe suas solicitações e veja o andamento do suporte.</p>
        </div>
        <Botao para="/chamados/novo">
          <span aria-hidden="true">＋</span> Novo chamado
        </Botao>
      </header>

      <section className="numeros numeros-solicitante" aria-label="Resumo dos seus chamados">
        <article className="numero numero-total">
          <span className="numero-icone" aria-hidden="true">▤</span>
          <div>
            <span className="numero-legenda">Total de solicitações</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true">◷</span>
          <div>
            <span className="numero-legenda">Aguardando equipe</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true">✓</span>
          <div>
            <span className="numero-legenda">Em atendimento</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
      </section>

      <section className="chamados-secao" aria-labelledby="titulo-meus-chamados">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">ACOMPANHAMENTO</span>
            <h2 id="titulo-meus-chamados">Suas solicitações</h2>
          </div>
        </div>
        <div className="ferramentas">
          <label className="busca">
            <span className="oculto">Buscar por título</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar chamado"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
          <span className="resultado-contagem">Dados indisponíveis</span>
        </div>

        <EstadoVazio
          titulo="Chamados indisponíveis"
          texto={
            termo
              ? 'A busca ficará disponível quando houver uma fonte de dados real.'
              : 'Os chamados voltarão a ser exibidos quando houver uma fonte de dados real.'
          }
          acao={termo ? null : <Botao para="/chamados/novo">Abrir o primeiro chamado</Botao>}
        />
      </section>
    </>
  )
}
