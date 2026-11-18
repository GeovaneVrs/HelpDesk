import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { autenticacaoApi } from '../services/autenticacao'
import { sessaoApi } from '../services/api'

const AutenticacaoContexto = createContext(null)

export function ProvedorAutenticacao({ children }) {
  const [usuario, setUsuario] = useState(() => sessaoApi.lerUsuario())
  const [estado, setEstado] = useState(() => (sessaoApi.lerToken() ? 'carregando' : 'anonimo'))
  const [erroSessao, setErroSessao] = useState('')

  const limparSessao = useCallback(() => {
    sessaoApi.limpar()
    setUsuario(null)
    setEstado('anonimo')
    setErroSessao('')
  }, [])

  const carregarUsuario = useCallback(async () => {
    if (!sessaoApi.lerToken()) {
      setEstado('anonimo')
      return
    }

    setEstado('carregando')
    setErroSessao('')
    try {
      const atual = await autenticacaoApi.usuarioAtual()
      sessaoApi.salvarUsuario(atual)
      setUsuario(atual)
      setEstado('autenticado')
    } catch (erro) {
      if (erro.status === 401) return
      setErroSessao(erro.message || 'Não foi possível validar sua sessão.')
      setEstado('erro')
    }
  }, [])

  useEffect(() => {
    carregarUsuario()
    window.addEventListener('helpdesk:sessao-expirada', limparSessao)
    return () => window.removeEventListener('helpdesk:sessao-expirada', limparSessao)
  }, [carregarUsuario, limparSessao])

  const entrar = useCallback(async (email, senha) => {
    const resultado = await autenticacaoApi.entrar(email, senha)
    sessaoApi.salvar(resultado)
    setUsuario(resultado.usuario)
    setEstado('autenticado')
    return resultado.usuario
  }, [])

  const cadastrar = useCallback((dados) => autenticacaoApi.cadastrar(dados), [])

  const sair = useCallback(async () => {
    try {
      await autenticacaoApi.sair()
    } finally {
      limparSessao()
    }
  }, [limparSessao])

  const valor = useMemo(() => ({
    usuario,
    estado,
    erroSessao,
    entrar,
    cadastrar,
    sair,
    atualizarUsuario(atualizado) {
      sessaoApi.salvarUsuario(atualizado)
      setUsuario(atualizado)
    },
    recarregarSessao: carregarUsuario,
  }), [usuario, estado, erroSessao, entrar, cadastrar, sair, carregarUsuario])

  return <AutenticacaoContexto.Provider value={valor}>{children}</AutenticacaoContexto.Provider>
}

export function useAutenticacao() {
  const contexto = useContext(AutenticacaoContexto)
  if (!contexto) throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao.')
  return contexto
}
