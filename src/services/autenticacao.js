import { API_URL, cabecalhosApi, lerResposta } from './api'

export const autenticacaoApi = {
  entrar(email, senha) {
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ email, senha }),
    }).then(lerResposta)
  },

  usuarioAtual() {
    return fetch(`${API_URL}/auth/me`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  sair() {
    return fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  cadastrar(dados) {
    return fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },
}
