import { API_URL, cabecalhosApi, lerResposta } from './api'

export const departamentosApi = {
  listar({ apenasAtivos = false } = {}) {
    const query = apenasAtivos ? '?apenasAtivos=true' : ''
    return fetch(`${API_URL}/departamentos${query}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  obter(id) {
    return fetch(`${API_URL}/departamentos/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  criar(dados) {
    return fetch(`${API_URL}/departamentos`, {
      method: 'POST',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  atualizar(id, dados) {
    return fetch(`${API_URL}/departamentos/${id}`, {
      method: 'PUT',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  ativar(id) {
    return fetch(`${API_URL}/departamentos/${id}/ativar`, {
      method: 'PATCH',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  desativar(id) {
    return fetch(`${API_URL}/departamentos/${id}/desativar`, {
      method: 'PATCH',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },
}
