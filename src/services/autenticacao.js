import { api } from './api'

export const autenticacaoApi = {
  entrar(email, senha) {
    return api.post('/auth/login', { email, senha })
  },

  usuarioAtual() {
    return api.get('/auth/me')
  },

  sair() {
    return api.post('/auth/logout')
  },

  cadastrar(dados) {
    return api.post('/usuarios', dados)
  },
}
