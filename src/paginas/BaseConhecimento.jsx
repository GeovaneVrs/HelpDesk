import { useMemo, useState } from 'react'
import { BookOpen, CircleHelp, Mail, Monitor, Printer, Wifi } from 'lucide-react'
import { Botao } from '../componentes/Botao'
import { EstadoVazio } from '../componentes/EstadoVazio'
import { useSessao } from '../contexto/Sessao'
import { useTitulo } from '../uteis/useTitulo'

const ARTIGOS = [
  {
    id: 'acesso-email',
    categoria: 'Acesso',
    icone: Mail,
    titulo: 'Não consigo acessar meu e-mail',
    resumo: 'Confira os passos para recuperar o acesso à sua conta de e-mail.',
    passos: [
      'Confirme se o endereço de e-mail foi digitado corretamente.',
      'Verifique se a conexão com a internet está funcionando.',
      'Use a opção “Esqueci minha senha” para iniciar a recuperação.',
      'Se o problema continuar, abra um chamado informando a mensagem de erro. Nunca envie sua senha.',
    ],
  },
  {
    id: 'computador-nao-liga',
    categoria: 'Computadores',
    icone: Monitor,
    titulo: 'O computador não liga',
    resumo: 'Faça algumas verificações simples antes de pedir atendimento.',
    passos: [
      'Confira se o cabo de energia está conectado ao computador e à tomada.',
      'Teste a tomada com outro aparelho que esteja funcionando.',
      'Em notebooks, conecte o carregador por alguns minutos e tente novamente.',
      'Se não ligar, registre um chamado e descreva o que acontece ao apertar o botão.',
    ],
  },
  {
    id: 'wifi-vpn',
    categoria: 'Rede',
    icone: Wifi,
    titulo: 'Wi-Fi ou VPN está desconectando',
    resumo: 'Veja o que testar quando a conexão cai ou não é estabelecida.',
    passos: [
      'Desative e ative o Wi-Fi e confirme se a rede correta está selecionada.',
      'Reinicie o computador e tente se conectar novamente.',
      'Se estiver usando VPN, confirme que a internet funciona antes de abrir o aplicativo.',
      'Ao abrir um chamado, informe em quais horários a conexão cai e qual rede está usando.',
    ],
  },
  {
    id: 'impressora',
    categoria: 'Impressão',
    icone: Printer,
    titulo: 'A impressora não imprime corretamente',
    resumo: 'Verifique papel, conexão e fila de impressão.',
    passos: [
      'Confira se há papel e se não existe alguma folha presa.',
      'Verifique se a impressora está ligada e conectada à rede.',
      'Confira se o documento correto aparece na fila de impressão.',
      'Se o erro persistir, informe o nome ou local da impressora no chamado.',
    ],
  },
  {
    id: 'abrir-chamado',
    categoria: 'Chamados',
    icone: CircleHelp,
    titulo: 'Como abrir um chamado que ajude a equipe',
    resumo: 'Uma descrição clara ajuda o suporte a entender e resolver o problema mais rápido.',
    passos: [
      'Use um título curto que resuma o problema.',
      'Conte o que estava fazendo e quando o problema começou.',
      'Descreva as mensagens de erro e o que você já tentou.',
      'Não inclua senhas ou outras informações pessoais no chamado.',
    ],
  },
  {
    id: 'acompanhar-chamado',
    categoria: 'Chamados',
    icone: BookOpen,
    titulo: 'Como acompanhar meu chamado',
    resumo: 'Acompanhe atualizações e responda à equipe pela conversa do chamado.',
    passos: [
      'Acesse a área “Chamados” no menu lateral.',
      'Localize sua solicitação e abra a conversa.',
      'Leia as mensagens da equipe e responda no campo ao final da conversa.',
      'As solicitações e mensagens ficam salvas neste navegador.',
    ],
  },
]

const CATEGORIAS = ['Todas', ...new Set(ARTIGOS.map((artigo) => artigo.categoria))]

export function BaseConhecimento() {
  const { usuario } = useSessao()
  const [categoria, setCategoria] = useState('Todas')
  const [busca, setBusca] = useState('')
  const termo = busca.trim().toLocaleLowerCase('pt-BR')

  useTitulo('Base de conhecimento')

  const artigosVisiveis = useMemo(() => ARTIGOS.filter((artigo) => {
    const correspondeCategoria = categoria === 'Todas' || artigo.categoria === categoria
    const texto = `${artigo.titulo} ${artigo.resumo} ${artigo.categoria} ${artigo.passos.join(' ')}`
      .toLocaleLowerCase('pt-BR')
    return correspondeCategoria && texto.includes(termo)
  }), [categoria, termo])

  const destino = usuario.papel === 'solicitante' ? '/chamados/novo' : '/chamados'
  const textoAcao = usuario.papel === 'solicitante' ? 'Abrir um chamado' : 'Ver chamados'

  return (
    <div className="base-conhecimento">
      <header className="cabecalho-pagina conhecimento-cabecalho">
        <div>
          <span className="sobretitulo">AJUDA E SUPORTE</span>
          <h1>Base de conhecimento</h1>
          <p className="subtitulo">Respostas rápidas para os problemas mais comuns.</p>
        </div>
        <span className="conhecimento-total">{artigosVisiveis.length} {artigosVisiveis.length === 1 ? 'artigo' : 'artigos'}</span>
      </header>

      <section className="conhecimento-painel" aria-label="Artigos de ajuda">
        <div className="conhecimento-ferramentas">
          <label className="busca conhecimento-busca">
            <span className="oculto">Buscar na base de conhecimento</span>
            <span className="busca-icone" aria-hidden="true">⌕</span>
            <input
              className="entrada"
              type="search"
              placeholder="Buscar uma solução"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
          <div className="conhecimento-categorias" role="group" aria-label="Filtrar por categoria">
            {CATEGORIAS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={categoria === item}
                className={categoria === item ? 'conhecimento-categoria ativo' : 'conhecimento-categoria'}
                onClick={() => setCategoria(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {artigosVisiveis.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum artigo encontrado"
            texto="Tente outra busca ou escolha uma categoria diferente."
          />
        ) : (
          <div className="artigos-grade">
            {artigosVisiveis.map((artigo) => {
              const Icone = artigo.icone

              return (
                <article className="artigo-card" key={artigo.id}>
                  <div className="artigo-cabecalho">
                    <span className="artigo-icone" aria-hidden="true"><Icone size={18} strokeWidth={1.8} /></span>
                    <span className="artigo-categoria">{artigo.categoria}</span>
                  </div>
                  <h2>{artigo.titulo}</h2>
                  <p className="artigo-resumo">{artigo.resumo}</p>
                  <details className="artigo-detalhes">
                    <summary>Ver passo a passo</summary>
                    <ol>
                      {artigo.passos.map((passo) => <li key={passo}>{passo}</li>)}
                    </ol>
                  </details>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <aside className="conhecimento-ajuda">
        <div>
          <strong>Não encontrou o que precisava?</strong>
          <p>Conte à equipe o que está acontecendo e acompanhe a resposta por aqui.</p>
        </div>
        <Botao para={destino}>{textoAcao}</Botao>
      </aside>
    </div>
  )
}
