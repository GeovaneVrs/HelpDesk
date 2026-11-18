export const STATUS_CHAMADO = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO']
export const CATEGORIAS_CHAMADO = ['HARDWARE', 'SOFTWARE', 'REDE', 'IMPRESSORA', 'ACESSO', 'OUTROS']
export const PRIORIDADES_CHAMADO = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']

export const ROTULOS_STATUS = {
  ABERTO: 'Aberto',
  EM_ANDAMENTO: 'Em andamento',
  RESOLVIDO: 'Resolvido',
  FECHADO: 'Fechado',
}

export const ROTULOS_PRIORIDADE = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  URGENTE: 'Urgente',
}

export const ROTULOS_CATEGORIA = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  REDE: 'Rede',
  IMPRESSORA: 'Impressora',
  ACESSO: 'Acesso',
  OUTROS: 'Outros',
}

export function nomeStatus(status) {
  return ROTULOS_STATUS[status] || status
}

export function nomePapel(role) {
  return ({ USER: 'Solicitante', TECHNICIAN: 'Técnico', ADMIN: 'Administrador' })[role] || role
}
