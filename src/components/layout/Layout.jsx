import { useEffect, useState } from 'react'
import {
  BookOpen,
  Building,
  ChartColumn,
  CirclePlus,
  ContactRound,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Moon,
  Settings,
  Sun,
  Ticket,
  Users,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAutenticacao } from '../../contexto/Autenticacao'
import { mensagemDeErro } from '../../services/api'
import { iniciais } from '../../utils/texto'
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
  const { usuario, sair } = useAutenticacao()
  const { pathname } = useLocation()
  const [escuro, setEscuro] = useState(() => document.documentElement.dataset.tema === 'escuro')
  const [erroSair, setErroSair] = useState('')
  const ehAdmin = usuario.role === 'ADMIN'
  const ehEquipe = usuario.role === 'TECHNICIAN' || ehAdmin

  function alternarTema() {
    setEscuro((atual) => {
      const proximo = !atual
      document.documentElement.dataset.tema = proximo ? 'escuro' : 'claro'
      localStorage.setItem('helpdesk.tema', proximo ? 'escuro' : 'claro')
      return proximo
    })
  }

  async function encerrarSessao() {
    setErroSair('')
    try {
      await sair()
    } catch (erro) {
      setErroSair(mensagemDeErro(erro))
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <aside className="barra-lateral">
        <Marca para="/entrar" />
        <nav className="nav-grupo" aria-label="Menu principal">
          {ehEquipe ? <ItemMenu para="/painel" rotulo="Visão geral" texto="Resumo da fila e do tempo de resposta." Icone={LayoutDashboard} /> : null}
          <ItemMenu para="/chamados" rotulo="Chamados" texto="Solicitações abertas e o andamento de cada uma." Icone={Ticket} />
          {usuario.role === 'USER' ? <ItemMenu para="/chamados/novo" rotulo="Novo chamado" texto="Registrar um problema para a equipe atender." Icone={CirclePlus} /> : null}
          <ItemMenu para="/conhecimento" rotulo="Base de conhecimento" texto="Artigos para resolver sem abrir um chamado." Icone={BookOpen} />
          {ehEquipe ? (
            <>
              <ItemMenu para="/relatorios" rotulo="Relatórios" texto="Números do atendimento por período." Icone={ChartColumn} />
              <ItemMenu para="/equipe" rotulo="Equipe" texto="Quem atende e a carga de cada pessoa." Icone={Users} />
              <ItemMenu para="/solicitantes" rotulo="Solicitantes" texto="Pessoas que abrem chamado e o histórico delas." Icone={ContactRound} />
            </>
          ) : null}
          <ItemMenu para="/solicitacoes-tecnico" rotulo={ehAdmin ? 'Solicitações técnicas' : 'Tornar-se técnico'} texto="Gerencie ou acompanhe solicitações para a equipe técnica." Icone={Users} />
          <ItemMenu para="/configuracoes" rotulo="Configurações" texto="Preferências da conta e do atendimento." Icone={Settings} />
          <ItemMenu para="/alterar-senha" rotulo="Alterar senha" texto="Atualize a senha da sua conta." Icone={LockKeyhole} />
          {ehAdmin ? (
            <>
              <ItemMenu para="/admin/usuarios" rotulo="Usuários" texto="Gerencie usuários e permissões." Icone={ContactRound} />
              <ItemMenu para="/admin/departamentos" rotulo="Departamentos" texto="Gerencie departamentos." Icone={Building} />
            </>
          ) : null}
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
          <span className="nav-link nav-perfil" tabIndex={0} aria-label={`${usuario.name}. ${usuario.role}`}>
            <span className="avatar">{iniciais(usuario.name)}</span>
            <Dica rotulo={usuario.name} texto={usuario.role} />
          </span>
          <button type="button" className="nav-link" aria-label="Sair" onClick={encerrarSessao}>
            <LogOut {...icone} />
            <Dica rotulo="Sair" texto="Encerrar sessão" />
          </button>
        </div>
      </aside>

      <div className="app-principal">
        {erroSair ? <p className="banner" role="alert">{erroSair}</p> : null}
        <main className="conteudo"><Outlet /></main>
        <footer className="rodape"><span>HELPDESK</span><span>Projeto acadêmico · Equipe Rocket · AV1</span></footer>
      </div>
    </div>
  )
}
