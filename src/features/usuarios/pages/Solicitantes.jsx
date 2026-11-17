import { useState } from 'react'
import { Clock, Ticket, UsersRound } from 'lucide-react'
import { HistoricoChamados } from '../../chamados/components/HistoricoChamados'
import { CartaoPessoa } from '../components/CartaoPessoa'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
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
  const pessoas = []

  useTitulo('Solicitantes')

  const contagens = {
    todos: '—',
    aguardando: '—',
    sem: '—',
  }

  const termo = busca.trim().toLowerCase()
  const visiveis = pessoas.filter((pessoa) => {
    if (filtro === 'aguardando' && pessoa.aguardando === 0) return false
    if (filtro === 'sem' && pessoa.total > 0) return false
    return `${pessoa.nome} ${pessoa.email}`.toLowerCase().includes(termo)
  })

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
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
        <article className="numero numero-meus">
          <span className="numero-icone" aria-hidden="true"><Ticket size={19} /></span>
          <div>
            <span className="numero-legenda">Chamados registrados</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
          </div>
        </article>
        <article className="numero numero-aberto">
          <span className="numero-icone" aria-hidden="true"><Clock size={19} /></span>
          <div>
            <span className="numero-legenda">Aguardando equipe</span>
            <strong>—</strong>
            <span className="numero-nota">Dados indisponíveis</span>
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
                <span className="filtro-contagem">{contagens[opcao.id]}</span>
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

        {visiveis.length === 0 ? (
          <EstadoVazio
            titulo="Dados de solicitantes indisponíveis"
            texto={termo
              ? 'A busca ficará disponível quando houver uma fonte de dados real.'
              : 'Os dados de solicitantes não estão disponíveis nesta etapa.'}
          />
        ) : (
          <div className="pessoas">
            {visiveis.map((pessoa) => (
              <CartaoPessoa
                key={pessoa.id}
                nome={pessoa.nome}
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
        )}
      </section>
    </>
  )
}