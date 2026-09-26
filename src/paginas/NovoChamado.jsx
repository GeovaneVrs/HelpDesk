import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../componentes/Botao'
import { CampoTexto } from '../componentes/CampoTexto'
import { useSessao } from '../contexto/Sessao'
import { criarChamado } from '../servicos/chamados'
import { useTitulo } from '../uteis/useTitulo'

const DICAS = [
  { titulo: 'O que aconteceu', texto: 'O sintoma, a tela ou o equipamento.' },
  { titulo: 'Desde quando', texto: 'Se começou agora ou já se repete.' },
  { titulo: 'O que você tentou', texto: 'Reiniciar, trocar cabo ou testar outro acesso.' },
]

export function NovoChamado() {
  const { usuario } = useSessao()
  const navegar = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erros, setErros] = useState({})

  useTitulo('Novo chamado')

  function enviar(evento) {
    evento.preventDefault()
    const resultado = criarChamado({ titulo, descricao, autor: usuario })
    if (!resultado.ok) {
      setErros(resultado.erros)
      return
    }
    navegar('/chamados')
  }

  return (
    <section className="novo">
      <Botao para="/chamados" variante="texto">
        ← Chamados
      </Botao>

      <div className="novo-grade">
        <header className="novo-intro">
          <span className="sobretitulo">Solicitação</span>
          <h1>Novo chamado</h1>
          <p className="subtitulo">
            Descreva o problema com clareza para o responsável entender o que precisa de atenção.
          </p>
          <ul className="novo-dicas">
            {DICAS.map((dica) => (
              <li key={dica.titulo}>
                <strong>{dica.titulo}</strong>
                <span>{dica.texto}</span>
              </li>
            ))}
          </ul>
        </header>

        <form className="novo-cartao" onSubmit={enviar} noValidate>
          <CampoTexto
            rotulo="Título"
            autoFocus
            maxLength={100}
            placeholder="Ex.: Computador não liga"
            value={titulo}
            extra={<span className="contador">{titulo.length}/100</span>}
            onChange={(evento) => {
              setTitulo(evento.target.value)
              setErros({})
            }}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') evento.preventDefault()
            }}
            erro={erros.titulo}
          />
          <CampoTexto
            rotulo="Descrição"
            multilinha
            maxLength={1000}
            placeholder="Conte o que aconteceu, desde quando e o que você já tentou."
            value={descricao}
            extra={<span className="contador">{descricao.length}/1000</span>}
            onChange={(evento) => {
              setDescricao(evento.target.value)
              setErros({})
            }}
            erro={erros.descricao}
          />
          <p className="novo-nota">Quanto mais claro, mais rápido o atendimento começa.</p>
          <div className="novo-acoes">
            <Botao para="/chamados" variante="secundario">
              Cancelar
            </Botao>
            <Botao type="submit">Registrar chamado</Botao>
          </div>
        </form>
      </div>
    </section>
  )
}
