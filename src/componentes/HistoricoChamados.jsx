import { podeConversar } from '../servicos/chamados'
import { formatarData, textoResponsavel } from '../uteis/texto'
import { Botao } from './Botao'

export function HistoricoChamados({ chamados, usuario, mostrar = 'responsavel', vazio }) {
  if (chamados.length === 0) {
    return <p className="historico-vazio">{vazio}</p>
  }

  return (
    <ul className="historico-lista">
      {chamados.map((chamado) => (
        <li key={chamado.id}>
          <div className="historico-texto">
            <strong>{chamado.titulo}</strong>
            <span>
              {formatarData(chamado.criadoEm)}
              {' · '}
              {mostrar === 'autor'
                ? `Aberto por ${chamado.autorNome}`
                : textoResponsavel(chamado, usuario.id)}
            </span>
          </div>
          <span className={`selo selo-${chamado.status.toLowerCase()}`}>{chamado.status}</span>
          {podeConversar(chamado, usuario) ? (
            <Botao para={`/chamados/${chamado.id}`} variante="texto">Abrir conversa</Botao>
          ) : null}
        </li>
      ))}
    </ul>
  )
}