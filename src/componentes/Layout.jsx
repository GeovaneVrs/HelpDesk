import { useEffect } from 'react'
import {
  BookOpen,
  ChartColumn,
  CirclePlus,
  ContactRound,
  LayoutDashboard,
  LogOut,
  Settings,
  Ticket,
  Users,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSessao } from '../contexto/Sessao'
import { iniciais } from '../uteis/texto'
import { Marca } from './Marca'

const icone = { size: 18, strokeWidth: 1.75, className: 'nav-icone', 'aria-hidden': true }

function Dica({ rotulo, texto }) {
  return (
    <span className="nav-dica">
      <strong>{rotulo}</strong>
      <small>{texto}</small>
    </span>
  )
}

function ItemMenu({ para, rotulo, texto, Icone }) {
  return (
    <NavLink
      to={para}
      end
      aria-label={`${rotulo}. ${texto}`}
      className={({ isActive }) => isActive ? 'nav-link ativo' : 'nav-link'}
    >
      <Icone {...icone} />
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
            <ItemMenu para="/painel" rotulo="Visão geral" texto="Resumo da fila e do tempo de resposta." Icone={LayoutDashboard} />
          ) : null}
          <ItemMenu para="/chamados" rotulo="Chamados" texto="Solicitações abertas e o andamento de cada uma." Icone={Ticket} />
          {usuario.papel === 'solicitante' ? (
            <ItemMenu para="/chamados/novo" rotulo="Novo chamado" texto="Registrar um problema para a equipe atender." Icone={CirclePlus} />
          ) : null}
          <ItemMenu para="/conhecimento" rotulo="Base de conhecimento" texto="Artigos para resolver sem abrir um chamado." Icone={BookOpen} />
          {usuario.papel === 'responsavel' ? (
            <>
              <ItemMenu para="/relatorios" rotulo="Relatórios" texto="Números do atendimento por período." Icone={ChartColumn} />
              <ItemMenu para="/equipe" rotulo="Equipe" texto="Quem atende e a carga de cada pessoa." Icone={Users} />
              <ItemMenu para="/solicitantes" rotulo="Solicitantes" texto="Pessoas que abrem chamado e o histórico delas." Icone={ContactRound} />
            </>
          ) : null}
          <ItemMenu para="/configuracoes" rotulo="Configurações" texto="Preferências da conta e do atendimento." Icone={Settings} />
        </nav>

        <div className="lateral-perfil">
          <span className="nav-link nav-perfil" tabIndex={0} aria-label={`${usuario.nome}. ${papel}`}>
            <span className="avatar">{iniciais(usuario.nome)}</span>
            <Dica rotulo={usuario.nome} texto={papel} />
          </span>
          <button type="button" className="nav-link nav-sair" aria-label="Sair. Encerrar a sessão neste navegador." onClick={sair}>
            <LogOut {...icone} />
            <Dica rotulo="Sair" texto="Encerrar a sessão neste navegador." />
          </button>
        </div>
      </aside>

      <div className="app-principal">
        <main className="conteudo"><Outlet /></main>
        <footer className="rodape"><span>HELPDESK</span><span>Projeto acadêmico · Equipe Rocket · AV1</span></footer>
      </div>
    </div>
  )
}
