import { useTitulo } from '../uteis/useTitulo'

export function EmDesenvolvimento({ titulo, texto }) {
  useTitulo(titulo)

  return (
    <section className="em-breve">
      <span className="em-breve-selo">Em desenvolvimento</span>
      <h1>{titulo}</h1>
      <p>{texto}</p>
    </section>
  )
}
