import { formatarData } from '../../../utils/texto'
import { Botao } from '../../../components/ui/Botao'
import { nomeStatus } from '../dominio'

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
              {formatarData(chamado.createdAt || chamado.criadoEm)}
              {' · '}
              {mostrar === 'autor'
                ? `Aberto por ${chamado.solicitanteNome || chamado.autorNome || 'solicitante'}`
                : chamado.tecnicoNome ? `Técnico: ${chamado.tecnicoNome}` : 'Sem responsável'}
            </span>
          </div>
          <span className={`selo selo-${chamado.status.toLowerCase()}`}>{nomeStatus(chamado.status)}</span>
          <Botao para={`/chamados/${chamado.id}`} variante="texto">Abrir conversa</Botao>
        </li>
      ))}
    </ul>
  )
}