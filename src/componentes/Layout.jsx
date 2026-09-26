import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSessao } from '../contexto/Sessao'
import { iniciais } from '../uteis/texto'
import { Marca } from './Marca'

function Icone({ children }) {
  return (
    <svg className="nav-icone" viewBox="0 0 20 20" aria-hidden="true">
      {children}
    </svg>
  )
}

const ROTULOS = {
  '/painel': 'Visão geral',
  '/chamados': 'Chamados',
  '/chamados/novo': 'Novo chamado',
  '/conhecimento': 'Base de conhecimento',
  '/relatorios': 'Relatórios',
  '/equipe': 'Equipe',
  '/solicitantes': 'Solicitantes',
  '/configuracoes': 'Configurações',
}

function trilha(pathname) {
  if (/^\/chamados\/.+/.test(pathname) && !pathname.endsWith('/novo')) return 'Conversa'
  return ROTULOS[pathname] || 'Chamados'
}

function Dica({ rotulo, texto }) {
  return (
    <span className="nav-dica">
      <strong>{rotulo}</strong>
      <small>{texto}</small>
    </span>
  )
}

function ItemMenu({ para, rotulo, texto, children }) {
  return (
    <NavLink
      to={para}
      end
      aria-label={`${rotulo}. ${texto}`}
      className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
    >
      <Icone>{children}</Icone>
      <Dica rotulo={rotulo} texto={texto} />
    </NavLink>
  )
}

export function Layout() {
  const { usuario, sair } = useSessao()
  const { pathname } = useLocation()
  const inicio = usuario.papel === 'responsavel' ? '/painel' : '/chamados'
  const papel = usuario.papel === 'responsavel' ? 'Equipe de suporte' : 'Solicitante'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <aside className="barra-lateral">
        <Marca para={inicio} />
        <nav className="nav-grupo" aria-label="Menu principal">
          {usuario.papel === 'responsavel' ? (
            <ItemMenu para="/painel" rotulo="Visão geral" texto="Resumo da fila e do tempo de resposta.">
              <rect x="3" y="3" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="11" y="3" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="3" y="11" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="11" y="11" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </ItemMenu>
          ) : null}
          <ItemMenu para="/chamados" rotulo="Chamados" texto="Solicitações abertas e o andamento de cada uma.">
            <rect x="3.2" y="3.2" width="13.6" height="13.6" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M6.4 7.2h7.2M6.4 10h7.2M6.4 12.8h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </ItemMenu>
          {usuario.papel === 'solicitante' ? (
            <ItemMenu para="/chamados/novo" rotulo="Novo chamado" texto="Registrar um problema para a equipe atender.">
              <circle cx="10" cy="10" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 6.8v6.4M6.8 10h6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </ItemMenu>
          ) : null}
          <ItemMenu para="/conhecimento" rotulo="Base de conhecimento" texto="Artigos para resolver sem abrir um chamado.">
            <path d="M5 4.5h6.2A2.3 2.3 0 0 1 13.5 6.8V16H7.2A2.2 2.2 0 0 0 5 18.2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M15 4.5h.8A2.2 2.2 0 0 1 18 6.7V16h-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </ItemMenu>
          {usuario.papel === 'responsavel' ? (
            <>
              <ItemMenu para="/relatorios" rotulo="Relatórios" texto="Números do atendimento por período.">
                <path d="M4.5 15.5V10M10 15.5V4.5M15.5 15.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </ItemMenu>
              <ItemMenu para="/equipe" rotulo="Equipe" texto="Quem atende e a carga de cada pessoa.">
                <circle cx="7.2" cy="7.2" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="13" cy="7.6" r="1.7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3.8 14.8c.5-2 2-3 3.4-3s2.9 1 3.4 3M11.2 14.8c.3-1.4 1.3-2.3 2.4-2.3 1.2 0 2.1.8 2.5 2.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </ItemMenu>
              <ItemMenu para="/solicitantes" rotulo="Solicitantes" texto="Pessoas que abrem chamado e o histórico delas.">
                <circle cx="10" cy="7" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M5.2 15.2c.7-2.4 2.5-3.6 4.8-3.6s4.1 1.2 4.8 3.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </ItemMenu>
            </>
          ) : null}
          <ItemMenu para="/configuracoes" rotulo="Configurações" texto="Preferências da conta e do atendimento.">
            <circle cx="10" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 3.8v1.8M10 14.4v1.8M3.8 10h1.8M14.4 10h1.8M5.4 5.4l1.3 1.3M13.3 13.3l1.3 1.3M14.6 5.4l-1.3 1.3M6.7 13.3 5.4 14.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </ItemMenu>
        </nav>

        <div className="lateral-perfil">
          <span className="nav-link nav-perfil" tabIndex={0} aria-label={`${usuario.nome}. ${papel}`}>
            <span className="avatar">{iniciais(usuario.nome)}</span>
            <Dica rotulo={usuario.nome} texto={papel} />
          </span>
          <button type="button" className="nav-link nav-sair" aria-label="Sair. Encerrar a sessão neste navegador." onClick={sair}>
            <Icone>
              <path d="M8 4.5H5.2A1.2 1.2 0 0 0 4 5.7v8.6a1.2 1.2 0 0 0 1.2 1.2H8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M10.5 10H16M13.8 7.4 16.4 10l-2.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </Icone>
            <Dica rotulo="Sair" texto="Encerrar a sessão neste navegador." />
          </button>
        </div>
      </aside>

      <div className="app-principal">
        <header className="topo">
          <div className="topo-interno">
            <span className="breadcrumb">Helpdesk <span aria-hidden="true">/</span> {trilha(pathname)}</span>
            <div className="topo-status"><span className="status-online" /> Sistema acadêmico · Equipe Rocket</div>
          </div>
        </header>
        <main className="conteudo"><Outlet /></main>
        <footer className="rodape"><span>HELPDESK</span><span>Projeto acadêmico · Equipe Rocket · AV1</span></footer>
      </div>
    </div>
  )
}
