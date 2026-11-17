import { useEffect, useState } from 'react'
import {
  BookOpen,
  ChartColumn,
  CirclePlus,
  ContactRound,
  LayoutDashboard,
  Moon,
  Settings,
  Sun,
  Ticket,
  Users,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Marca } from '../ui/Marca'

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
  const { pathname } = useLocation()
  const [escuro, setEscuro] = useState(() => document.documentElement.dataset.tema === 'escuro')

  function alternarTema() {
    setEscuro((atual) => {
      const proximo = !atual
      document.documentElement.dataset.tema = proximo ? 'escuro' : 'claro'
      localStorage.setItem('helpdesk.tema', proximo ? 'escuro' : 'claro')
      return proximo
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <aside className="barra-lateral">
        <Marca para="/entrar" />
        <nav className="nav-grupo" aria-label="Menu principal">
          <ItemMenu para="/painel" rotulo="Visão geral" texto="Resumo da fila e do tempo de resposta." Icone={LayoutDashboard} />
          <ItemMenu para="/chamados" rotulo="Chamados" texto="Solicitações abertas e o andamento de cada uma." Icone={Ticket} />
          <ItemMenu para="/chamados/novo" rotulo="Novo chamado" texto="Registrar um problema para a equipe atender." Icone={CirclePlus} />
          <ItemMenu para="/conhecimento" rotulo="Base de conhecimento" texto="Artigos para resolver sem abrir um chamado." Icone={BookOpen} />
          <ItemMenu para="/relatorios" rotulo="Relatórios" texto="Números do atendimento por período." Icone={ChartColumn} />
          <ItemMenu para="/equipe" rotulo="Equipe" texto="Quem atende e a carga de cada pessoa." Icone={Users} />
          <ItemMenu para="/solicitantes" rotulo="Solicitantes" texto="Pessoas que abrem chamado e o histórico delas." Icone={ContactRound} />
          <ItemMenu para="/configuracoes" rotulo="Configurações" texto="Preferências da conta e do atendimento." Icone={Settings} />
        </nav>

        <div className="lateral-perfil">
          <button
            type="button"
            className="nav-link"
            aria-label={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
            onClick={alternarTema}
          >
            {escuro ? <Sun {...icone} /> : <Moon {...icone} />}
            <Dica rotulo={escuro ? 'Tema claro' : 'Tema escuro'} texto={escuro ? 'Volta para o fundo branco.' : 'Troca o branco por preto.'} />
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
