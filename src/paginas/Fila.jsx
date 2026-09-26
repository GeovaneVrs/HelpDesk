import { useState } from 'react'
import { Botao } from '../componentes/Botao'
import { CartaoChamado } from '../componentes/CartaoChamado'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { useSessao } from '../contexto/Sessao'
import { assumirChamado, listarChamados } from '../servicos/chamados'
import { detalhesDoChamado } from '../uteis/texto'
import { useTitulo } from '../uteis/useTitulo'

const FILTROS = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'livres', rotulo: 'Sem responsável' },
  { id: 'meus', rotulo: 'Comigo' },
]

export function Fila() {
  const { usuario } = useSessao()
  const [chamados, setChamados] = useState(() => listarChamados())
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  useTitulo('Chamados')

  const termo = busca.trim().toLowerCase()
  const porFiltro = chamados.filter((chamado) => {
    if (filtro === 'livres') return !chamado.responsavelId
    if (filtro === 'meus') return chamado.responsavelId === usuario.id
    return true
  })
  const visiveis = porFiltro.filter((chamado) =>
    `${chamado.titulo} ${chamado.autorNome}`.toLowerCase().includes(termo),
  )
  const livres = chamados.filter((chamado) => !chamado.responsavelId).length

  function assumir(id) {
    const resultado = assumirChamado(id, usuario)
    setChamados(listarChamados())
    setErro(resultado.ok ? '' : resultado.erro)
  }

  const vazio = termo
    ? 'Nenhum chamado corresponde à sua busca.'
    : filtro === 'livres'
      ? 'Todos os chamados já têm responsável.'
      : filtro === 'meus'
        ? 'Você ainda não assumiu nenhum chamado.'
        : 'Quando alguém abrir um chamado, ele aparecerá aqui.'

  return (
    <>
      <header className="cabecalho-pagina">
        <div>
          <span className="sobretitulo">EQUIPE DE SUPORTE</span>
          <h1>Chamados</h1>
          <p className="subtitulo">Assuma um chamado e abra a conversa com o solicitante.</p>
        </div>
      </header>

      <section className="chamados-secao" aria-labelledby="titulo-fila">
        <div className="secao-cabecalho">
          <div>
            <span className="sobretitulo">FILA</span>
            <h2 id="titulo-fila">Solicitações</h2>
            <p className="subtitulo">A equipe atende por aqui. Não é possível abrir um chamado novo.</p>
          </div>
        </div>
        <div className="ferramentas painel-ferramentas">
          <div className="segmentos" role="group" aria-label="Filtrar chamados">
            {FILTROS.map((opcao) => (
              <button
                key={opcao.id}
                type="button"
                aria-pressed={filtro === opcao.id}
                className={filtro === opcao.id ? 'segmento ativo' : 'segmento'}
                onClick={() => setFiltro(opcao.id)}
              >
                {opcao.rotulo}
                {opcao.id === 'livres' ? <span className="filtro-contagem">{livres}</span> : null}
              </button>
            ))}
          </div>
          <label className="busca">
            <span className="oculto">Buscar chamado ou solicitante</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar chamado ou solicitante"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        {erro ? <p className="banner" role="alert">{erro}</p> : null}
        {visiveis.length === 0 ? (
          <EstadoVazio titulo="Nenhum resultado" texto={vazio} />
        ) : (
          <div className="lista">
            {visiveis.map((chamado) => (
              <CartaoChamado
                key={chamado.id}
                titulo={chamado.titulo}
                descricao={chamado.descricao}
                status={chamado.status}
                detalhes={detalhesDoChamado(chamado, usuario.id, true)}
                acao={
                  chamado.responsavelId === usuario.id ? (
                    <div className="chamado-acoes">
                      <span className="responsavel-atribuido">✓ Com você</span>
                      <Botao para={`/chamados/${chamado.id}`}>Abrir conversa</Botao>
                    </div>
                  ) : chamado.responsavelId ? (
                    <span className="responsavel-atribuido">✓ {chamado.responsavelNome}</span>
                  ) : (
                    <Botao type="button" onClick={() => assumir(chamado.id)}>
                      Assumir chamado
                    </Botao>
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
