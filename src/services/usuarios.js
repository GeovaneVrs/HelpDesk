import { api } from './api'

export const usuariosApi = {
  listar(role) {
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    return api.get(`/usuarios${query}`)
  },

  obter(id) {
    return api.get(`/usuarios/${id}`)
  },

  cadastrar(dados) {
    return api.post('/usuarios', dados)
  },

  atualizarProprioPerfil(dados) {
    return api.put('/usuarios/me', dados)
  },

  alterarPropriaSenha(dados) {
    return api.patch('/usuarios/me/senha', dados)
  },

  atualizar(id, dados) {
    return api.put(`/usuarios/${id}`, dados)
  },

  alterarRole(id, role) {
    return api.patch(`/usuarios/${id}/role`, { role })
  },

  ativar(id) {
    return api.patch(`/usuarios/${id}/ativar`)
  },

  desativar(id) {
    return api.patch(`/usuarios/${id}/desativar`)
  },
}
