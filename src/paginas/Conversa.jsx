import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Botao } from '../componentes/Botao'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { useSessao } from '../contexto/Sessao'
import { obterChamado, podeConversar } from '../servicos/chamados'
import { enviarMensagem, listarMensagens } from '../servicos/mensagens'
import { formatarData, iniciais } from '../uteis/texto'
import { useTitulo } from '../uteis/useTitulo'

export function Conversa() {
  const { id } = useParams()
  const { usuario } = useSessao()
  const fim = useRef(null)
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const [chamado, setChamado] = useState(() => obterChamado(id))
  const [mensagens, setMensagens] = useState(() => listarMensagens(id))

  const permitido = podeConversar(chamado, usuario)
  const voltar = usuario.papel === 'responsavel' ? '/painel' : '/chamados'

  useTitulo(chamado ? chamado.titulo : 'Conversa')

  useEffect(() => {
    fim.current?.scrollIntoView({ block: 'end' })
  }, [mensagens.length])

  function enviar(evento) {
    evento.preventDefault()
    const resultado = enviarMensagem({ chamadoId: id, autor: usuario, texto })
    if (!resultado.ok) {
      setErro(resultado.erro)
      return
    }
    setTexto('')
    setErro('')
    setChamado(obterChamado(id))
    setMensagens(listarMensagens(id))
  }

  if (!chamado || !permitido) {
    return (
      <EstadoVazio
        titulo="Conversa indisponível"
        texto="Este chamado não existe ou ainda não está com você."
        acao={<Botao para={voltar}>Voltar</Botao>}
      />
    )
  }

  return (
    <section className="conversa">
      <div className="conversa-painel">
      <header className="conversa-cabecalho">
        <Botao para={voltar} variante="texto">
          ← {usuario.papel === 'responsavel' ? 'Visão geral' : 'Chamados'}
        </Botao>
        <div className="conversa-titulo">
          <h1>{chamado.titulo}</h1>
          <p>{chamado.descricao}</p>
        </div>
        <div className="conversa-lado">
          <span className={`selo selo-${chamado.status.toLowerCase()}`}>{chamado.status}</span>
          <p>
            {chamado.autorNome}
            {' · '}
            {chamado.responsavelNome || 'Sem responsável'}
          </p>
        </div>
      </header>
        <div className="mensagens" aria-live="polite">
          {mensagens.length === 0 ? (
            <p className="mensagens-vazias">Nenhuma mensagem ainda. Escreva a primeira para começar o atendimento.</p>
          ) : (
            mensagens.map((mensagem) => {
              const minha = mensagem.autorId === usuario.id
              return (
                <article key={mensagem.id} className={minha ? 'mensagem mensagem-minha' : 'mensagem'}>
                  <span className="mensagem-avatar" aria-hidden="true">{iniciais(mensagem.autorNome)}</span>
                  <div>
                    <header>
                      <strong>{minha ? 'Você' : mensagem.autorNome}</strong>
                      <time dateTime={mensagem.criadoEm}>{formatarData(mensagem.criadoEm)}</time>
                    </header>
                    <p>{mensagem.texto}</p>
                  </div>
                </article>
              )
            })
          )}
          <div ref={fim} />
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
              setErro('')
            }}
          />
          <div className="conversa-enviar">
            <span className="contador">{texto.trim().length}/500</span>
            <Botao type="submit">Enviar</Botao>
          </div>
          {erro ? <p className="mensagem-erro" role="alert">{erro}</p> : null}
        </form>
      </div>
    </section>
  )
}
