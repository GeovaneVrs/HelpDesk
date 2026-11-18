import { api } from './api'

export const chamadosApi = {
  listar(filtros = {}) {
    const query = new URLSearchParams()

    if (filtros.status) {
      query.set('status', filtros.status)
    }

    const parametros = query.toString()
    return api.get(`/chamados${parametros ? `?${parametros}` : ''}`)
  },

  listarMeus() {
    return api.get('/chamados/meus')
  },

  listarAtribuidos() {
    return api.get('/chamados/atribuidos')
  },

  listarPorUsuario(id) {
    return api.get(`/chamados/usuario/${id}`)
  },

  listarPorTecnico(id) {
    return api.get(`/chamados/tecnico/${id}`)
  },

  obter(id) {
    return api.get(`/chamados/${id}`)
  },

  listarHistorico(id) {
    return api.get(`/chamados/${id}/historico`)
  },

  criar(dados) {
    return api.post('/chamados', dados)
  },

  atualizar(id, dados) {
    return api.put(`/chamados/${id}`, dados)
  },

  atribuirTecnico(id, tecnicoId) {
    return api.patch(`/chamados/${id}/tecnico`, { tecnicoId })
  },

  alterarStatus(id, status) {
    return api.patch(`/chamados/${id}/status`, { status })
  },

  comentar(id, mensagem) {
    return api.post(`/chamados/${id}/comentarios`, { mensagem })
  },
}
