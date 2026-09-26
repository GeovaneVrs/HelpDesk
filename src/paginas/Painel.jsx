import { useState } from 'react'
import { Botao } from '../componentes/Botao'
import { useSessao } from '../contexto/Sessao'
import { listarChamados } from '../servicos/chamados'
import { listarMensagens } from '../servicos/mensagens'
import { useTitulo } from '../uteis/useTitulo'

function horasEntre(inicio, fim) {
  const ms = new Date(fim).getTime() - new Date(inicio).getTime()
  if (!Number.isFinite(ms) || ms < 0) return 0
  return ms / 36e5
}

function formatarDuracao(horas) {
  if (horas < 1) {
    const minutos = Math.max(1, Math.round(horas * 60))
    return `${minutos} min`
  }
  if (horas < 48) {
    const inteiras = Math.round(horas)
    return inteiras === 1 ? '1 hora' : `${inteiras} horas`
  }
  const dias = Math.round(horas / 24)
  return dias === 1 ? '1 dia' : `${dias} dias`
}

function marcoDeResposta(chamado) {
  if (chamado.assumidoEm) return chamado.assumidoEm
  if (!chamado.responsavelId) return null
  const resposta = listarMensagens(chamado.id).find((mensagem) => mensagem.autorId === chamado.responsavelId)
  return resposta?.criadoEm || null
}

export function Painel() {
  const { usuario } = useSessao()
  const [chamados] = useState(() => listarChamados())

  useTitulo('Visão geral')

  const agora = new Date()
  const atribuidos = chamados.filter((chamado) => chamado.responsavelId)
  const livres = chamados.filter((chamado) => !chamado.responsavelId)
  const total = chamados.length
  const primeiroNome = usuario.nome?.trim().split(/\s+/)[0] || 'equipe'

  const tempos = chamados.map((chamado) => {
    const marco = marcoDeResposta(chamado)
    if (marco) {
      return { id: chamado.id, titulo: chamado.titulo, horas: horasEntre(chamado.criadoEm, marco), tipo: 'resposta' }
    }
    if (!chamado.responsavelId) {
      return { id: chamado.id, titulo: chamado.titulo, horas: horasEntre(chamado.criadoEm, agora), tipo: 'espera' }
    }
    return { id: chamado.id, titulo: chamado.titulo, horas: null, tipo: 'sem-marco' }
  })

  const respondidos = tempos.filter((item) => item.tipo === 'resposta')
  const media = respondidos.length
    ? respondidos.reduce((soma, item) => soma + item.horas, 0) / respondidos.length
    : null
  const semMarco = tempos.filter((item) => item.tipo === 'sem-marco').length
  const barras = tempos
    .filter((item) => item.horas !== null)
    .sort((a, b) => b.horas - a.horas)
  const maior = Math.max(...barras.map((item) => item.horas), 1)
  const volta = 2 * Math.PI * 58
  const trechoAtribuido = total ? (atribuidos.length / total) * volta : 0

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">CENTRAL DE ATENDIMENTO</span>
          <h1>Visão geral</h1>
          <p className="subtitulo">Olá, {primeiroNome}. O resumo da fila e do tempo até o atendimento.</p>
        </div>
        <Botao para="/chamados">Ver chamados</Botao>
      </header>

      <section className="painel-graficos" aria-label="Gráficos da fila">
        <article className="grafico-cartao">
          <span className="sobretitulo">ATRIBUIÇÃO</span>
          <h2>Chamados da fila</h2>
          <div className="donut-corpo">
            <svg className="donut" viewBox="0 0 160 160" role="img" aria-label={`${atribuidos.length} atribuídos e ${livres.length} sem atribuição`}>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#f3e7d4" strokeWidth="16" />
              {total > 0 ? (
                <circle
                  className="donut-arco"
                  cx="80"
                  cy="80"
                  r="58"
                  fill="none"
                  stroke="#3d74ea"
                  strokeWidth="16"
                  strokeDasharray={`${trechoAtribuido} ${volta - trechoAtribuido}`}
                  transform="rotate(-90 80 80)"
                  style={{ '--volta': `${volta}px` }}
                />
              ) : null}
              <text x="80" y="78" textAnchor="middle" className="donut-numero">{total}</text>
              <text x="80" y="98" textAnchor="middle" className="donut-rotulo">chamados</text>
            </svg>
            <ul className="donut-lista">
              <li>
                <span><i className="ponto ponto-grafico-atribuido" />Atribuídos</span>
                <strong>{atribuidos.length}</strong>
              </li>
              <li>
                <span><i className="ponto ponto-grafico-livre" />Sem atribuição</span>
                <strong>{livres.length}</strong>
              </li>
            </ul>
          </div>
        </article>

        <article className="grafico-cartao">
          <div className="grafico-topo">
            <div>
              <span className="sobretitulo">TEMPO DE RESPOSTA</span>
              <h2>Até alguém assumir</h2>
            </div>
            <p className="tempo-media">
              <strong>{media === null ? '—' : formatarDuracao(media)}</strong>
              <span>{media === null ? 'sem medição ainda' : 'média dos atribuídos'}</span>
            </p>
          </div>

          {barras.length === 0 ? (
            <p className="grafico-vazio">Quando houver chamados, o tempo de cada um aparece aqui.</p>
          ) : (
            <ul className="tempo-lista">
              {barras.map((item) => (
                <li key={item.id} className="tempo-item">
                  <span className="tempo-nome">{item.titulo}</span>
                  <strong>{formatarDuracao(item.horas)}</strong>
                  <div className="tempo-trilho" role="img" aria-label={`${item.titulo}: ${formatarDuracao(item.horas)}, ${item.tipo === 'resposta' ? 'até assumir' : 'ainda sem atribuição'}`}>
                    <span
                      className={item.tipo === 'resposta' ? 'tempo-resposta' : 'tempo-espera'}
                      style={{ width: `${Math.max(8, (item.horas / maior) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {semMarco > 0 ? (
            <p className="grafico-nota">
              {semMarco === 1
                ? '1 chamado atribuído antes desta medição não entra na média.'
                : `${semMarco} chamados atribuídos antes desta medição não entram na média.`}
              {' '}Os próximos passam a contar.
            </p>
          ) : null}
          <div className="grafico-legenda">
            <span><i className="ponto ponto-grafico-atribuido" />Tempo até assumir</span>
            <span><i className="ponto ponto-grafico-livre" />Ainda sem atribuição</span>
          </div>
        </article>
      </section>
    </>
  )
}
