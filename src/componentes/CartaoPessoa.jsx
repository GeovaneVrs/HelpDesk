import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { iniciais } from '../uteis/texto'

export function CartaoPessoa({ nome, email, destaque, numeros = [], extra, children }) {
  const [aberto, setAberto] = useState(false)
  const historicoId = useId()

  return (
    <article className={aberto ? 'pessoa pessoa-aberta' : 'pessoa'}>
      <div className="pessoa-linha">
        <span className="pessoa-avatar" aria-hidden="true">{iniciais(nome)}</span>

        <div className="pessoa-info">
          <h3>
            {nome}
            {destaque ? <span className="pessoa-destaque">{destaque}</span> : null}
          </h3>
          <span className="pessoa-email">{email}</span>
          {extra}
        </div>

        <dl className="pessoa-numeros">
          {numeros.map((item) => (
            <div key={item.rotulo}>
              <dt>{item.rotulo}</dt>
              <dd>{item.valor}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="pessoa-alternar"
          aria-expanded={aberto}
          aria-controls={historicoId}
          onClick={() => setAberto((atual) => !atual)}
        >
          {aberto ? 'Fechar' : 'Ver histórico'}
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {aberto ? (
        <div className="pessoa-historico" id={historicoId}>
          {children}
        </div>
      ) : null}
    </article>
  )
}