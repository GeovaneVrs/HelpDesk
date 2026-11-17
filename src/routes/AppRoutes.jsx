import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { RotaProtegida } from '../components/layout/RotaProtegida'
import { Cadastrar } from '../features/autenticacao/pages/Cadastrar'
import { Entrar } from '../features/autenticacao/pages/Entrar'
import { BaseConhecimento } from '../features/base-conhecimento/pages/BaseConhecimento'
import { PaginaChamados } from '../features/chamados/pages/Chamados'
import { Conversa } from '../features/chamados/pages/Conversa'
import { NovoChamado } from '../features/chamados/pages/NovoChamado'
import { Painel } from '../features/dashboard/pages/Painel'
import { Relatorios } from '../features/dashboard/pages/Relatorios'
import { Configuracoes } from '../features/usuarios/pages/Configuracoes'
import { Equipe } from '../features/usuarios/pages/Equipe'
import { Solicitantes } from '../features/usuarios/pages/Solicitantes'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/entrar" replace />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/cadastrar" element={<Cadastrar />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/chamados" element={<PaginaChamados />} />
          <Route path="/chamados/novo" element={<NovoChamado />} />
          <Route path="/chamados/:id" element={<Conversa />} />
          <Route path="/conhecimento" element={<BaseConhecimento />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/solicitantes" element={<Solicitantes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
