import { API_URL, cabecalhosApi, lerResposta } from './api'

export const chamadosApi = {
  listar(filtros = {}) {
    const query = new URLSearchParams()

    if (filtros.status) {
      query.set('status', filtros.status)
    }

    const parametros = query.toString()
    return fetch(`${API_URL}/chamados${parametros ? `?${parametros}` : ''}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarMeus() {
    return fetch(`${API_URL}/chamados/meus`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarAtribuidos() {
    return fetch(`${API_URL}/chamados/atribuidos`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarPorUsuario(id) {
    return fetch(`${API_URL}/chamados/usuario/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarPorTecnico(id) {
    return fetch(`${API_URL}/chamados/tecnico/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  obter(id) {
    return fetch(`${API_URL}/chamados/${id}`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  listarHistorico(id) {
    return fetch(`${API_URL}/chamados/${id}/historico`, {
      headers: cabecalhosApi(),
    }).then(lerResposta)
  },

  criar(dados) {
    return fetch(`${API_URL}/chamados`, {
      method: 'POST',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  atualizar(id, dados) {
    return fetch(`${API_URL}/chamados/${id}`, {
      method: 'PUT',
      headers: cabecalhosApi(true),
      body: JSON.stringify(dados),
    }).then(lerResposta)
  },

  atribuirTecnico(id, tecnicoId) {
    return fetch(`${API_URL}/chamados/${id}/tecnico`, {
      method: 'PATCH',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ tecnicoId }),
    }).then(lerResposta)
  },

  alterarStatus(id, status) {
    return fetch(`${API_URL}/chamados/${id}/status`, {
      method: 'PATCH',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ status }),
    }).then(lerResposta)
  },

  comentar(id, mensagem) {
    return fetch(`${API_URL}/chamados/${id}/comentarios`, {
      method: 'POST',
      headers: cabecalhosApi(true),
      body: JSON.stringify({ mensagem }),
    }).then(lerResposta)
  },
}
