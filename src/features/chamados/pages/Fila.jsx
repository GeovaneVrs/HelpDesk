import { useState } from 'react'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useTitulo } from '../../../hooks/useTitulo'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'livres', rotulo: 'Sem responsável' },
  { id: 'meus', rotulo: 'Comigo' },
]

export function Fila() {
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')

  useTitulo('Chamados')

  const termo = busca.trim().toLowerCase()

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Assuma um chamado e abra a conversa com o solicitante.</p>
        </div>
      </header>

      <section className="chamados-secao" aria-labelledby="titulo-fila">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">FILA</span>
            <h2 id="titulo-fila">Solicitações</h2>
            <p className="subtitulo">A equipe atende por aqui. Não é possível abrir um chamado novo.</p>
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
                <span className="filtro-contagem">—</span>
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

        <EstadoVazio
          titulo="Fila indisponível"
          texto={termo ? 'Não há dados reais para corresponder à busca.' : 'Os chamados serão listados quando houver uma fonte de dados real.'}
        />
      </section>
    </>
  )
}
