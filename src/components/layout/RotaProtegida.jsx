import { Navigate, Outlet } from 'react-router-dom'
import { useAutenticacao } from '../../contexto/Autenticacao'
import { Botao } from '../ui/Botao'

export function RotaProtegida({ roles }) {
  const { usuario, estado, erroSessao, recarregarSessao } = useAutenticacao()

  if (estado === 'carregando') {
    return <p className="estado-requisicao">Validando sessão...</p>
  }

  if (estado === 'erro') {
    return (
      <section className="estado-requisicao" role="alert">
        <p>{erroSessao}</p>
        <Botao type="button" onClick={recarregarSessao}>Tentar novamente</Botao>
      </section>
    )
  }

  if (!usuario) return <Navigate to="/entrar" replace />
  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to={usuario.role === 'USER' ? '/chamados' : '/painel'} replace />
  }

  return <Outlet />
}
