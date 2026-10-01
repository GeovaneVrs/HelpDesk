import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { RotaProtegida } from './componentes/RotaProtegida'
import { useSessao } from './contexto/Sessao'
import { Cadastrar } from './paginas/Cadastrar'
import { BaseConhecimento } from './paginas/BaseConhecimento'
import { PaginaChamados } from './paginas/Chamados'
import { Conversa } from './paginas/Conversa'
import { Entrar } from './paginas/Entrar'
import { NovoChamado } from './paginas/NovoChamado'
import { Painel } from './paginas/Painel'
import { Configuracoes } from './paginas/Configuracoes'
import { Equipe } from './paginas/Equipe'
import { Relatorios } from './paginas/Relatorios'
import { Solicitantes } from './paginas/Solicitantes'

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
  /relatorios       área dos responsáveis / gráfico ilustrativo dos chamados
  /equipe           área dos responsáveis / carga de atendimento
  /solicitantes     área dos responsáveis / pessoas que abrem chamados
  /configuracoes    dados da conta e preferências
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
            <Route path="/relatorios" element={<Relatorios titulo="Relatórios" />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/solicitantes" element={<Solicitantes />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
