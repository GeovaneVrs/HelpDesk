import { API_URL, cabecalhosApi, lerResposta } from './api'

export const solicitacoesTecnicoApi = {
  listar(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return fetch(`${API_URL}/solicitacoes${query}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarMinhas() {
    return fetch(`${API_URL}/solicitacoes/minhas`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarPorUsuario(id) {
    return fetch(`${API_URL}/solicitacoes/usuario/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  obter(id) {
    return fetch(`${API_URL}/solicitacoes/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  solicitar() {
    return fetch(`${API_URL}/solicitacoes`, {
      method: 'POST',
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  aprovar(id, observacao) {
    const dados = observacao ? { observacao } : undefined
    return fetch(`${API_URL}/solicitacoes/${id}/aprovar`, {
      method: 'PATCH',
      headers: cabecalhosApi(Boolean(dados)),
      ...(dados ? { body: JSON.stringify(dados) } : {}),
    }).then(lerResposta)
  },

  rejeitar(id, motivo) {
    return fetch(`${API_URL}/solicitacoes/${id}/rejeitar`, {
      method: 'PATCH',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ motivo }),
    }).then(lerResposta)
  },
}
