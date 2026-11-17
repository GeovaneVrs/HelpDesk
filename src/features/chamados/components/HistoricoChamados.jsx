import { formatarData, textoResponsavel } from '../../../utils/texto'
import { Botao } from '../../../components/ui/Botao'

export function HistoricoChamados({ chamados, mostrar = 'responsavel', vazio }) {
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
                : textoResponsavel(chamado, null)}
            </span>
          </div>
          <span className={`selo selo-${chamado.status.toLowerCase()}`}>{chamado.status}</span>
          <Botao para={`/chamados/${chamado.id}`} variante="texto">Abrir conversa</Botao>
        </li>
      ))}
    </ul>
  )
}