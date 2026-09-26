import { Link } from 'react-router-dom'

export function Marca({ para = '/' }) {
  return (
    <Link to={para} className="marca" aria-label="Helpdesk — página inicial">
      <svg
        className="marca-icone"
        viewBox="0 0 40 40"
        role="img"
        aria-label="Ícone de suporte"
      >
        <defs>
          <linearGradient id="marca-gradiente" x1="5" y1="3" x2="35" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3298ff" />
            <stop offset="1" stopColor="#0061ce" />
          </linearGradient>
        </defs>
        <rect className="marca-fundo" width="40" height="40" rx="13" fill="url(#marca-gradiente)" />
        <path
          className="marca-balao"
          d="M11.5 12.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-5.2l-5.1 4v-4h-1.7a3 3 0 0 1-3-3z"
          fill="none"
          stroke="white"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        <path d="M16 15h9M16 19h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path className="marca-brilho" d="m30.5 7 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#bde5ff" />
      </svg>
      <span className="marca-nome">Helpdesk</span>
    </Link>
  )
}
