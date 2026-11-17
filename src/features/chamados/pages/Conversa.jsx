import { useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { useTitulo } from '../../../hooks/useTitulo'

export function Conversa() {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')

  useTitulo('Conversa')

  function enviar(evento) {
    evento.preventDefault()

    if (!texto.trim()) {
      setAviso('Escreva uma mensagem.')
      return
    }

    setAviso('O envio de mensagens não está disponível nesta etapa. Nenhuma mensagem foi enviada.')
  }

  return (
    <section className="conversa">
      <div className="conversa-painel">
        <header className="conversa-cabecalho">
          <Botao para="/chamados" variante="texto">
            ← Chamados
          </Botao>
          <div className="conversa-titulo">
            <span className="sobretitulo">CONVERSA DO CHAMADO</span>
            <h1>Detalhes indisponíveis</h1>
            <p>Os dados do chamado não estão conectados a uma fonte real.</p>
          </div>
          <div className="conversa-lado">
            <span className="selo">Indisponível</span>
            <p>Solicitante e responsável indisponíveis</p>
          </div>
        </header>

        <div className="mensagens" aria-live="polite">
          <p className="mensagens-vazias">
            As mensagens da conversa serão exibidas quando houver uma fonte de dados real.
          </p>
        </div>

        <form className="conversa-form" onSubmit={enviar}>
          <label className="oculto" htmlFor="mensagem">Mensagem</label>
          <textarea
            id="mensagem"
            className="entrada"
            rows={3}
            maxLength={500}
            placeholder="Escreva uma mensagem"
            value={texto}
            onChange={(evento) => {
              setTexto(evento.target.value)
              setAviso('')
            }}
          />
          <div className="conversa-enviar">
            <span className="contador">{texto.trim().length}/500</span>
            <Botao type="submit">Enviar</Botao>
          </div>
          {aviso ? <p className="mensagem-erro" role="alert">{aviso}</p> : null}
        </form>
      </div>
    </section>
  )
}
