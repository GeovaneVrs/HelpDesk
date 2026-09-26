import { Navigate, Outlet } from 'react-router-dom'
import { useSessao } from '../contexto/Sessao'

/*
  Sem a prop papel, exige apenas login.
  Com papel="responsavel", só quem atende entra.
*/
export function RotaProtegida({ papel }) {
  const { usuario } = useSessao()

  if (!usuario) return <Navigate to="/entrar" replace />

  if (papel && usuario.papel !== papel) {
    const destino = usuario.papel === 'responsavel' ? '/painel' : '/chamados'
    return <Navigate to={destino} replace />
  }

  return <Outlet />
}
