import { useCallback, useState } from 'react'
import { Clock, Ticket, UsersRound } from 'lucide-react'
import { HistoricoChamados } from '../../chamados/components/HistoricoChamados'
import { CartaoPessoa } from '../components/CartaoPessoa'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useRecurso } from '../../../hooks/useRecurso'
import { chamadosApi } from '../../../services/chamados'
import { usuariosApi } from '../../../services/usuarios'
import { formatarData } from '../../../utils/texto'
import { useTitulo } from '../../../hooks/useTitulo'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'aguardando', rotulo: 'Com chamado aguardando' },
  { id: 'sem', rotulo: 'Sem chamados' },
]

export function Solicitantes() {
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const carregar = useCallback(async () => {
    const [usuarios, chamados] = await Promise.all([
      usuariosApi.listar('USER'),
      chamadosApi.listar(),
    ])
    return usuarios.map((usuario) => {
      const doUsuario = chamados
        .filter((chamado) => String(chamado.solicitanteId || chamado.usuarioId) === String(usuario.id))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return {
        ...usuario,
        chamados: doUsuario,
        total: doUsuario.length,
        aguardando: doUsuario.filter((chamado) => chamado.status === 'ABERTO').length,
        emAtendimento: doUsuario.filter((chamado) => chamado.status === 'EM_ANDAMENTO').length,
        ultimoChamadoEm: doUsuario[0]?.createdAt,
      }
    })
  }, [])
  const { dados: pessoas, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Solicitantes')

  const contagens = {
    todos: pessoas?.length ?? 0,
    aguardando: (pessoas || []).filter((pessoa) => pessoa.aguardando > 0).length,
    sem: (pessoas || []).filter((pessoa) => pessoa.total === 0).length,
  }

  const termo = busca.trim().toLocaleLowerCase('pt-BR')
  const visiveis = (pessoas || []).filter((pessoa) => {
    if (filtro === 'aguardando' && pessoa.aguardando === 0) return false
    if (filtro === 'sem' && pessoa.total > 0) return false
    return `${pessoa.name} ${pessoa.email}`.toLocaleLowerCase('pt-BR').includes(termo)
  })
  const todosChamados = (pessoas || []).flatMap((pessoa) => pessoa.chamados)
  const aguardandoTotal = todosChamados.filter((chamado) => chamado.status === 'ABERTO').length

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>
          <h1>Solicitantes</h1>
          <p className="subtitulo">As pessoas que abrem chamados e o histórico de cada uma.</p>
        </div>
      </header>

      <section className="numeros" aria-label="Resumo dos solicitantes">
        <article className="numero numero-total">
          <span className="numero-icone" aria-hidden="true"><UsersRound size={19} /></span>
          <div>
            <span className="numero-legenda">Solicitantes</span>
            <strong>{carregando ? '—' : pessoas?.length ?? 0}</strong>
            <span className="numero-nota">Contas solicitantes</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true"><Ticket size={19} /></span>
          <div>
            <span className="numero-legenda">Chamados registrados</span>
            <strong>{carregando ? '—' : todosChamados.length}</strong>
            <span className="numero-nota">Total registrado</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true"><Clock size={19} /></span>
          <div>
            <span className="numero-legenda">Aguardando equipe</span>
            <strong>{carregando ? '—' : aguardandoTotal}</strong>
            <span className="numero-nota">Status aberto</span>
          </div>
        </article>
      </section>

      <section className="chamados-secao" aria-labelledby="titulo-solicitantes">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">PESSOAS</span>
            <h2 id="titulo-solicitantes">Quem abre chamados</h2>
          </div>
        </div>

        <div className="ferramentas painel-ferramentas">
          <div className="segmentos" role="group" aria-label="Filtrar solicitantes">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={filtro === opcao.id}
                className={filtro === opcao.id ? 'segmento ativo' : 'segmento'}
                onClick={() => setFiltro(opcao.id)}
              >
                {opcao.rotulo}
                <span className="filtro-contagem">{carregando ? '—' : contagens[opcao.id]}</span>
              </button>
            ))}
          </div>
          <label className="busca">
            <span className="oculto">Buscar por nome ou e-mail</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar por nome ou e-mail"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && visiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum solicitante encontrado"
            texto={termo
              ? 'Tente outro termo de busca.'
              : 'Não há usuários com o perfil de solicitante.'}
          />
        ) : !erro && visiveis.length > 0 ? (
          <div className="pessoas">
            {visiveis.map((pessoa) => (
              <CartaoPessoa
                key={pessoa.id}
                nome={pessoa.name}
                email={pessoa.email}
                extra={
                  <span className="pessoa-nota">
                    {pessoa.ultimoChamadoEm
                      ? `Último chamado em ${formatarData(pessoa.ultimoChamadoEm)}`
                      : 'Ainda não abriu chamados'}
                  </span>
                }
                numeros={[
                  { rotulo: 'Chamados', valor: pessoa.total },
                  { rotulo: 'Aguardando', valor: pessoa.aguardando },
                  { rotulo: 'Em atendimento', valor: pessoa.emAtendimento },
                ]}
              >
                <HistoricoChamados
                  chamados={pessoa.chamados}
                  mostrar="responsavel"
                  vazio="Esta pessoa ainda não abriu chamados."
                />
              </CartaoPessoa>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}