import { useState } from 'react'
import { CircleCheck, Clock, Ticket } from 'lucide-react'
import { useTitulo } from '../../../hooks/useTitulo'

const PERIODOS = [
  { id: '7', rotulo: '7 dias', dias: 7 },
  { id: '30', rotulo: '30 dias', dias: 30 },
  { id: 'tudo', rotulo: 'Tudo', dias: null },
]

export function Relatorios() {
  const [periodo, setPeriodo] = useState('tudo')

  useTitulo('Relatórios')

  const escolhido = PERIODOS.find((opcao) => opcao.id === periodo)
  const notaPeriodo = escolhido.dias ? `Nos últimos ${escolhido.dias} dias` : 'Desde o início'

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>
          <h1>Relatórios</h1>
          <p className="subtitulo">Volume de chamados e tempo até o atendimento começar.</p>
        </div>
        <div className="segmentos" role="group" aria-label="Escolher período">
          {PERIODOS.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              aria-pressed={periodo === opcao.id}
              className={periodo === opcao.id ? 'segmento ativo' : 'segmento'}
              onClick={() => setPeriodo(opcao.id)}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
      </header>

      <section className="numeros" aria-label="Resumo dos chamados">
        <article className="numero numero-total">
          <span className="numero-icone" aria-hidden="true"><Ticket size={19} /></span>
          <div>
            <span className="numero-legenda">Total de chamados</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis · {notaPeriodo}</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true"><CircleCheck size={19} /></span>
          <div>
            <span className="numero-legenda">Com responsável</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true"><Clock size={19} /></span>
          <div>
            <span className="numero-legenda">Sem responsável</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
      </section>

      <section className="painel-graficos" aria-label="Gráficos do atendimento">
        <article className="grafico-cartao">
          <div className="grafico-topo">
            <div>
              <span className="sobretitulo">DISTRIBUIÇÃO</span>
              <h2>Chamados por situação</h2>
            </div>
          </div>

          <p className="grafico-vazio">
            Os gráficos serão exibidos quando houver dados reais de atendimento.
          </p>
        </article>

        <article className="grafico-cartao">
          <div className="grafico-topo">
            <div>
              <span className="sobretitulo">TEMPO DE RESPOSTA</span>
              <h2>Até alguém assumir</h2>
            </div>
          </div>

          <p className="grafico-vazio">
            Os tempos de resposta serão exibidos quando houver dados reais de atendimento.
          </p>
        </article>
      </section>
    </>
  )
}
