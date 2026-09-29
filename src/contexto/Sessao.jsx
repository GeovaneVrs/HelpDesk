import { createContext, useContext, useState } from 'react'
import { atualizarPerfil, cadastrar, encerrarSessao, entrar, obterSessao } from '../servicos/usuarios'

const SessaoContexto = createContext(null)

/*
  Guarda quem está logado.
  As telas usam useSessao() e não mexem no localStorage direto.
*/
export function ProvedorSessao({ children }) {
  const [usuario, setUsuario] = useState(() => obterSessao())

  function entrarNaSessao(email, senha) {
    const resultado = entrar(email, senha)
    if (resultado.ok) setUsuario(resultado.usuario)
    return resultado
  }

  function cadastrarNaSessao(dados) {
    const resultado = cadastrar(dados)
    if (resultado.ok) setUsuario(resultado.usuario)
    return resultado
  }

    function atualizarPerfilNaSessao(dados) {
    const resultado = atualizarPerfil(usuario.id, dados)

    if (resultado.ok) setUsuario(resultado.usuario)
      return resultado;
  }

  function sair() {
    encerrarSessao()
    setUsuario(null)
  }

  const valor = {
    usuario,
    entrar: entrarNaSessao,
    cadastrar: cadastrarNaSessao,
    atualizarPerfil: atualizarPerfilNaSessao,
    sair,
  }

  return <SessaoContexto.Provider value={valor}>{children}</SessaoContexto.Provider>
}

export function useSessao() {
  const contexto = useContext(SessaoContexto)

  if (!contexto) {
    throw new Error('useSessao só pode ser usado dentro de ProvedorSessao.')
  }

  return contexto
}
