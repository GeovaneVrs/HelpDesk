import { useMemo, useState } from 'react'
import { Mail, Ticket, Users } from 'lucide-react'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { lerLista } from '../dados/armazenamento'
import { CHAVES } from '../dados/armazenamento'
import { listarChamados } from '../servicos/chamados'
import { useTitulo } from '../uteis/useTitulo'

function iniciais(nome) {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function Equipe() {
  useTitulo('Equipe')

  const [busca, setBusca] = useState('')

  const usuarios = lerLista(CHAVES.usuarios)
  const chamados = listarChamados()

  const equipe = usuarios.filter(
    (usuario) => usuario.papel === 'responsavel',
  )

  const equipeComDados = useMemo(() => {
    return equipe.map((membro) => {
      const chamadosDoMembro = chamados.filter(
        (chamado) => chamado.responsavelId === membro.id,
      )

      const chamadosAbertos = chamadosDoMembro.filter(
        (chamado) => chamado.status === 'Aberto',
      )

      return {
        ...membro,
        totalChamados: chamadosDoMembro.length,
        chamadosAbertos: chamadosAbertos.length,
      }
    })
  }, [usuarios, chamados])

  const termo = busca.trim().toLowerCase()

  const membrosVisiveis = equipeComDados.filter((membro) =>
    `${membro.nome} ${membro.email}`
      .toLowerCase()
      .includes(termo),
  )

  const totalMembros = equipe.length

  const totalChamados = chamados.filter(
    (chamado) => chamado.responsavelId,
  ).length

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>

          <h1>Equipe</h1>

          <p className="subtitulo">
            Acompanhe os membros da equipe e a carga de chamados de cada pessoa.
          </p>
        </div>
      </header>

      <section className="equipe-resumo">
        <article className="equipe-resumo-card">
          <div className="equipe-resumo-icone">
            <Users size={20} />
          </div>

          <div>
            <span>MEMBROS</span>
            <strong>{totalMembros}</strong>
          </div>
        </article>

        <article className="equipe-resumo-card">
          <div className="equipe-resumo-icone">
            <Ticket size={20} />
          </div>

          <div>
            <span>CHAMADOS ATRIBUÍDOS</span>
            <strong>{totalChamados}</strong>
          </div>
        </article>
      </section>

      <section className="equipe-secao" aria-labelledby="titulo-equipe">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">MEMBROS</span>

            <h2 id="titulo-equipe">
              Profissionais de suporte
            </h2>

            <p className="subtitulo">
              Usuários que podem assumir e atender chamados.
            </p>
          </div>
        </div>

        <div className="ferramentas">
          <label className="busca">
            <span className="oculto">
              Buscar membro da equipe
            </span>

            <span className="busca-icone" aria-hidden="true">
              ⌕
            </span>

            <input
              className="entrada"
              type="search"
              placeholder="Buscar membro"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>

          <span className="resultado-contagem">
            {membrosVisiveis.length} membro(s)
          </span>
        </div>

        {membrosVisiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum membro encontrado"
            texto={
              termo
                ? 'Tente pesquisar por outro nome ou e-mail.'
                : 'Ainda não existem usuários na equipe de suporte.'
            }
          />
        ) : (
          <div className="equipe-lista">
            {membrosVisiveis.map((membro) => (
              <article className="membro-card" key={membro.id}>
                <div className="membro-cabecalho">
                  <div className="membro-avatar">
                    {iniciais(membro.nome)}
                  </div>

                  <div className="membro-identidade">
                    <h3>{membro.nome}</h3>

                    <span>
                      <Mail size={13} aria-hidden="true" />
                      {membro.email}
                    </span>
                  </div>

                  <span className="membro-status">
                    Suporte
                  </span>
                </div>

                <div className="membro-metricas">
                  <div>
                    <span>Chamados atribuídos</span>
                    <strong>{membro.totalChamados}</strong>
                  </div>

                  <div>
                    <span>Em aberto</span>
                    <strong>{membro.chamadosAbertos}</strong>
                  </div>
                </div>

                <div className="membro-carga">
                  <div className="membro-carga-topo">
                    <span>Carga atual</span>

                    <strong>
                      {membro.chamadosAbertos === 0
                        ? 'Livre'
                        : membro.chamadosAbertos <= 2
                          ? 'Normal'
                          : 'Alta'}
                    </strong>
                  </div>

                  <div className="membro-carga-trilho">
                    <span
                      style={{
                        width: `${Math.min(
                          membro.chamadosAbertos * 20,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}