import { api } from './api'

export const solicitacoesTecnicoApi = {
  listar(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return api.get(`/solicitacoes${query}`)
  },

  listarMinhas() {
    return api.get('/solicitacoes/minhas')
  },

  listarPorUsuario(id) {
    return api.get(`/solicitacoes/usuario/${id}`)
  },

  obter(id) {
    return api.get(`/solicitacoes/${id}`)
  },

  solicitar() {
    return api.post('/solicitacoes')
  },

  aprovar(id, observacao) {
    const dados = observacao ? { observacao } : undefined
    return api.patch(`/solicitacoes/${id}/aprovar`, dados)
  },

  rejeitar(id, motivo) {
    return api.patch(`/solicitacoes/${id}/rejeitar`, { motivo })
  },
}
