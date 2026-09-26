import { Link } from 'react-router-dom'

export function Botao({ children, variante = 'primario', bloco = false, para, ...resto }) {
  const classe = ['botao', `botao-${variante}`, bloco ? 'botao-bloco' : ''].filter(Boolean).join(' ')

  if (para) {
    return (
      <Link to={para} className={classe} {...resto}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classe} {...resto}>
      {children}
    </button>
  )
}
