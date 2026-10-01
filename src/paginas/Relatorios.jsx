import { useState } from 'react'
import { CircleCheck, Clock, Ticket } from 'lucide-react'
import { GraficoRosca } from '../componentes/GraficoRosca'
import { GraficoTempo } from '../componentes/GraficoTempo'
import { gerarRelatorio } from '../servicos/relatorios'
import { formatarDuracao } from '../uteis/texto'
import { useTitulo } from '../uteis/useTitulo'

const PERIODOS = [
  { id: '7', rotulo: '7 dias', dias: 7 },
  { id: '30', rotulo: '30 dias', dias: 30 },
  { id: 'tudo', rotulo: 'Tudo', dias: null },
]

export function Relatorios() {
  const [periodo, setPeriodo] = useState('tudo')

  useTitulo('Relatórios')

  const escolhido = PERIODOS.find((opcao) => opcao.id === periodo)
  const relatorio = gerarRelatorio(escolhido.dias)
  const notaPeriodo = escolhido.dias ? `Nos últimos ${escolhido.dias} dias` : 'Desde o início'
  const semTempos = relatorio.porResponsavel.length === 0 && relatorio.esperaAtual === null

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
            <strong>{relatorio.total}</strong>
            <span className="numero-nota">{notaPeriodo}</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true"><CircleCheck size={19} /></span>
          <div>
            <span className="numero-legenda">Com responsável</span>
            <strong>{relatorio.atribuidos}</strong>
            <span className="numero-nota">Já estão sendo atendidos</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true"><Clock size={19} /></span>
          <div>
            <span className="numero-legenda">Sem responsável</span>
            <strong>{relatorio.semResponsavel}</strong>
            <span className="numero-nota">Aguardando alguém assumir</span>
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

          {relatorio.total === 0 ? (
            <p className="grafico-vazio">
              Nenhum chamado neste período. Escolha um período maior para ver o gráfico.
            </p>
          ) : (
            <div className="donut-corpo">
              <GraficoRosca
                atribuidos={relatorio.atribuidos}
                semResponsavel={relatorio.semResponsavel}
              />
              <ul className="donut-lista">
                <li>
                  <span><span className="ponto ponto-grafico-atribuido" />Com responsável</span>
                  <strong>{relatorio.atribuidos}</strong>
                </li>
                <li>
                  <span><span className="ponto ponto-grafico-livre" />Sem responsável</span>
                  <strong>{relatorio.semResponsavel}</strong>
                </li>
              </ul>
            </div>
          )}
        </article>

        <article className="grafico-cartao">
          <div className="grafico-topo">
            <div>
              <span className="sobretitulo">TEMPO DE RESPOSTA</span>
              <h2>Até alguém assumir</h2>
            </div>
            {relatorio.tempoMedio !== null ? (
              <p className="tempo-media">
                <strong>{formatarDuracao(relatorio.tempoMedio)}</strong>
                <span>média da equipe</span>
              </p>
            ) : null}
          </div>

          {semTempos ? (
            <p className="grafico-vazio">
              Nenhum chamado neste período. Os tempos aparecem quando houver chamados abertos ou assumidos.
            </p>
          ) : (
            <GraficoTempo
              porResponsavel={relatorio.porResponsavel}
              esperaAtual={relatorio.esperaAtual}
            />
          )}
        </article>
      </section>
    </>
  )
}
