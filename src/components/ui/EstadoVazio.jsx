export function EstadoVazio({ titulo, texto, acao }) {
  return (
    <div className="vazio">
      <span className="vazio-icone" aria-hidden="true">
        <svg viewBox="0 0 48 48" width="44" height="44">
          <rect x="8" y="10" width="32" height="28" rx="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M16 20h16M16 26h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <h2>{titulo}</h2>
      <p>{texto}</p>
      {acao}
    </div>
  )
}
