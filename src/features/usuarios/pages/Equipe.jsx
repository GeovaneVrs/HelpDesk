import { useCallback, useState } from 'react'
import { Mail, Ticket, Users } from 'lucide-react'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useRecurso } from '../../../hooks/useRecurso'
import { chamadosApi } from '../../../services/chamados'
import { usuariosApi } from '../../../services/usuarios'
import { useTitulo } from '../../../hooks/useTitulo'
import { iniciais } from '../../../utils/texto'

export function Equipe() {
  useTitulo('Equipe')

  const [busca, setBusca] = useState('')

  const carregar = useCallback(async () => {
    const [membros, chamados] = await Promise.all([
      usuariosApi.listar('TECHNICIAN'),
      chamadosApi.listar(),
    ])
    return membros.map((membro) => {
      const atribuidos = chamados.filter((chamado) => String(chamado.tecnicoId || chamado.tecnico?.id) === String(membro.id))
      return {
        ...membro,
        totalChamados: atribuidos.length,
        chamadosAbertos: atribuidos.filter((chamado) => ['ABERTO', 'EM_ANDAMENTO'].includes(chamado.status)).length,
      }
    })
  }, [])
  const { dados: equipe, carregando, erro, recarregar } = useRecurso(carregar)
  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  const membrosVisiveis = (equipe || []).filter((membro) =>
    `${membro.name} ${membro.email}`.toLocaleLowerCase('pt-BR').includes(termo),
  )

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
            <strong>{carregando ? '—' : equipe?.length ?? 0}</strong>
          </div>
        </article>

        <article className="equipe-resumo-card">
          <div className="equipe-resumo-icone">
            <Ticket size={20} />
          </div>

          <div>
            <span>CHAMADOS ATRIBUÍDOS</span>
            <strong>{carregando ? '—' : equipe?.reduce((total, membro) => total + membro.totalChamados, 0) ?? 0}</strong>
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

          <span className="resultado-contagem">{membrosVisiveis.length} membros</span>
        </div>

        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && membrosVisiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum membro encontrado"
            texto={
              termo
                ? 'Tente outro termo de busca.'
                : 'Nenhum usuário está cadastrado com o perfil de técnico.'
            }
          />
        ) : (
          !erro && membrosVisiveis.length > 0 ? <div className="equipe-lista">
            {membrosVisiveis.map((membro) => (
              <article className="membro-card" key={membro.id}>
                <div className="membro-cabecalho">
                  <div className="membro-avatar">
                    {iniciais(membro.name)}
                  </div>

                  <div className="membro-identidade">
                    <h3>{membro.name}</h3>

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
          </div> : null
        )}
      </section>
    </>
  )
}