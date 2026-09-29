import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { RotaProtegida } from './componentes/RotaProtegida'
import { useSessao } from './contexto/Sessao'
import { Cadastrar } from './paginas/Cadastrar'
import { BaseConhecimento } from './paginas/BaseConhecimento'
import { PaginaChamados } from './paginas/Chamados'
import { Conversa } from './paginas/Conversa'
import { Entrar } from './paginas/Entrar'
import { EmDesenvolvimento } from './paginas/EmDesenvolvimento'
import { NovoChamado } from './paginas/NovoChamado'
import { Painel } from './paginas/Painel'
import { Configuracoes } from './paginas/Configuracoes'

/*
  Mapa das telas
  /                 manda para a tela certa de quem está logado
  /entrar           login
  /cadastrar        novo usuário
  /chamados         fila do técnico ou lista do solicitante
  /chamados/novo    abrir chamado, só solicitante
  /chamados/:id     conversa de quem abriu ou de quem assumiu
  /painel           só para o responsável
  /conhecimento     artigos de ajuda com busca e categorias
  /relatorios       ainda em desenvolvimento, só responsável
  /equipe           ainda em desenvolvimento, só responsável
  /solicitantes     ainda em desenvolvimento, só responsável
  /configuracoes    ainda em desenvolvimento
*/

function Inicio() {
  const { usuario } = useSessao()

  if (!usuario) return <Navigate to="/entrar" replace />

  const destino = usuario.papel === 'responsavel' ? '/painel' : '/chamados'
  return <Navigate to={destino} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/cadastrar" element={<Cadastrar />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/chamados" element={<PaginaChamados />} />
          <Route element={<RotaProtegida papel="solicitante" />}>
            <Route path="/chamados/novo" element={<NovoChamado />} />
          </Route>
          <Route path="/chamados/:id" element={<Conversa />} />
          <Route path="/conhecimento" element={<BaseConhecimento />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route element={<RotaProtegida papel="responsavel" />}>
            <Route path="/painel" element={<Painel />} />
            <Route path="/relatorios" element={<EmDesenvolvimento titulo="Relatórios" texto="Volume, tempo de resposta e fila por período." />} />
            <Route path="/equipe" element={<EmDesenvolvimento titulo="Equipe" texto="Quem atende, a carga de cada pessoa e os chamados em aberto." />} />
            <Route path="/solicitantes" element={<EmDesenvolvimento titulo="Solicitantes" texto="As pessoas que abrem chamado e o histórico de cada uma." />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
