export function CartaoChamado({ titulo, descricao, status, detalhes, acao }) {
  return (
    <article className="chamado">
      <div className="chamado-topo">
        <h2>{titulo}</h2>
        <span className={`selo selo-${status.toLowerCase()}`}>{status}</span>
      </div>
      <p className="chamado-descricao">{descricao}</p>
      <ul className="chamado-detalhes">
        {detalhes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {acao ? <div className="chamado-acao">{acao}</div> : null}
    </article>
  )
}
