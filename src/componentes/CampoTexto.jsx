import { useId } from 'react'

export function CampoTexto({ rotulo, erro, dica, extra, multilinha = false, id, ...resto }) {
  const gerado = useId()
  const campoId = id || gerado
  const Campo = multilinha ? 'textarea' : 'input'

  return (
    <div className={erro ? 'campo campo-erro' : 'campo'}>
      <div className="campo-cabeca">
        <label htmlFor={campoId}>{rotulo}</label>
        {extra}
      </div>
      <Campo
        id={campoId}
        className="entrada"
        aria-invalid={erro ? 'true' : 'false'}
        {...resto}
      />
      {erro ? <p className="mensagem-erro">{erro}</p> : null}
      {dica && !erro ? <p className="dica">{dica}</p> : null}
    </div>
  )
}
