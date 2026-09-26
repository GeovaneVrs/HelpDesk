import { useState } from 'react'
import { Botao } from '../componentes/Botao'
import { CartaoChamado } from '../componentes/CartaoChamado'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { useSessao } from '../contexto/Sessao'
import { Fila } from './Fila'
import { listarMeusChamados } from '../servicos/chamados'
import { detalhesDoChamado } from '../uteis/texto'
import { useTitulo } from '../uteis/useTitulo'

export function PaginaChamados() {
  const { usuario } = useSessao()
  return usuario.papel === 'responsavel' ? <Fila /> : <Chamados />
}

export function Chamados() {
  const { usuario } = useSessao()
  const [busca, setBusca] = useState('')
  const chamados = listarMeusChamados(usuario.id)

  useTitulo('Chamados')

  const termo = busca.trim().toLowerCase()
  const visiveis = chamados.filter((chamado) => chamado.titulo.toLowerCase().includes(termo))
  const aguardando = chamados.filter((chamado) => !chamado.responsavelId).length
  const emAtendimento = chamados.length - aguardando

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">ÁREA DO SOLICITANTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Acompanhe suas solicitações e veja o andamento do suporte.</p>
        </div>
        <Botao para="/chamados/novo">
          <span aria-hidden="true">＋</span> Novo chamado
        </Botao>
      </header>

      <section className="numeros numeros-solicitante" aria-label="Resumo dos seus chamados">
        <article className="numero numero-total">
          <span className="numero-icone" aria-hidden="true">▤</span>
          <div>
            <span className="numero-legenda">Total de solicitações</span>
            <strong>{chamados.length}</strong>
            <span className="numero-nota">Registradas por você</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true">◷</span>
          <div>
            <span className="numero-legenda">Aguardando equipe</span>
            <strong>{aguardando}</strong>
            <span className="numero-nota">Ainda sem responsável</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true">✓</span>
          <div>
            <span className="numero-legenda">Em atendimento</span>
            <strong>{emAtendimento}</strong>
            <span className="numero-nota">Com responsável atribuído</span>
          </div>
        </article>
      </section>

      <section className="chamados-secao" aria-labelledby="titulo-meus-chamados">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">ACOMPANHAMENTO</span>
            <h2 id="titulo-meus-chamados">Suas solicitações</h2>
          </div>
        </div>
        <div className="ferramentas">
          <label className="busca">
            <span className="oculto">Buscar por título</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar chamado"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
          <span className="resultado-contagem">{visiveis.length} {visiveis.length === 1 ? 'chamado' : 'chamados'}</span>
        </div>

        {visiveis.length === 0 ? (
          <EstadoVazio
            titulo={termo ? 'Nenhum chamado com esse título' : 'Você ainda não abriu chamados'}
            texto={
              termo
                ? 'Tente outro termo ou limpe a busca.'
                : 'Descreva o problema e acompanhe o atendimento por aqui.'
            }
            acao={termo ? null : <Botao para="/chamados/novo">Abrir o primeiro chamado</Botao>}
          />
        ) : (
          <div className="lista">
            {visiveis.map((chamado) => (
              <CartaoChamado
                key={chamado.id}
                titulo={chamado.titulo}
                descricao={chamado.descricao}
                status={chamado.status}
                detalhes={detalhesDoChamado(chamado, usuario.id, false)}
                acao={<Botao para={`/chamados/${chamado.id}`}>Abrir conversa</Botao>}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
