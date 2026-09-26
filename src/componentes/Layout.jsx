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

function trilha(pathname) {
  if (pathname.startsWith('/painel')) return 'Visão geral'
  if (pathname.includes('/novo')) return 'Novo chamado'
  if (/^\/chamados\/.+/.test(pathname)) return 'Conversa'
  return 'Chamados'
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
            <NavLink to="/painel" end data-rotulo="Visão geral" aria-label="Visão geral" className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
              <Icone>
                <rect x="3" y="3" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="3" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <rect x="3" y="11" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <rect x="11" y="11" width="6" height="6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </Icone>
            </NavLink>
          ) : null}
          <NavLink to="/chamados" end data-rotulo="Chamados" aria-label="Chamados" className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
            <Icone>
              <rect x="3.2" y="3.2" width="13.6" height="13.6" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M6.4 7.2h7.2M6.4 10h7.2M6.4 12.8h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </Icone>
          </NavLink>
          {usuario.papel === 'solicitante' ? (
            <NavLink to="/chamados/novo" data-rotulo="Novo chamado" aria-label="Novo chamado" className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}>
              <Icone>
                <circle cx="10" cy="10" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 6.8v6.4M6.8 10h6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </Icone>
            </NavLink>
          ) : null}
        </nav>

        <div className="lateral-perfil">
          <span className="avatar" title={`${usuario.nome} · ${papel}`}>{iniciais(usuario.nome)}</span>
          <button type="button" className="nav-link nav-sair" data-rotulo="Sair" aria-label="Sair da conta" onClick={sair}>
            <Icone>
              <path d="M8 4.5H5.2A1.2 1.2 0 0 0 4 5.7v8.6a1.2 1.2 0 0 0 1.2 1.2H8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M10.5 10H16M13.8 7.4 16.4 10l-2.6 2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </Icone>
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
