import { API_URL, cabecalhosApi, lerResposta } from './api'

export const usuariosApi = {
  listar(role) {
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    return fetch(`${API_URL}/usuarios${query}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  obter(id) {
    return fetch(`${API_URL}/usuarios/${id}`, {
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

  atualizarProprioPerfil(dados) {
    return fetch(`${API_URL}/usuarios/me`, {
      method: 'PUT',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  alterarPropriaSenha(dados) {
    return fetch(`${API_URL}/usuarios/me/senha`, {
      method: 'PATCH',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  atualizar(id, dados) {
    return fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  alterarRole(id, role) {
    return fetch(`${API_URL}/usuarios/${id}/role`, {
      method: 'PATCH',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ role }),
    }).then(lerResposta)
  },

  ativar(id) {
    return fetch(`${API_URL}/usuarios/${id}/ativar`, {
      method: 'PATCH',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  desativar(id) {
    return fetch(`${API_URL}/usuarios/${id}/desativar`, {
      method: 'PATCH',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },
}
