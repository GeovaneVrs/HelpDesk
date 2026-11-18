import { api } from './api'

export const departamentosApi = {
  listar({ apenasAtivos = false } = {}) {
    const query = apenasAtivos ? '?apenasAtivos=true' : ''
    return api.get(`/departamentos${query}`)
  },

  obter(id) {
    return api.get(`/departamentos/${id}`)
  },

  criar(dados) {
    return api.post('/departamentos', dados)
  },

  atualizar(id, dados) {
    return api.put(`/departamentos/${id}`, dados)
  },

  ativar(id) {
    return api.patch(`/departamentos/${id}/ativar`)
  },

  desativar(id) {
    return api.patch(`/departamentos/${id}/desativar`)
  },
}
