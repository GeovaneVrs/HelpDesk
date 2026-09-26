/*
  Textos prontos para a tela.
  Regra de negócio fica na pasta servicos, não aqui.
*/

export function formatarData(iso) {
  const data = new Date(iso)
  if (Number.isNaN(data.getTime())) return 'Data indisponível'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data)
}

export function iniciais(nome = '') {
  const partes = String(nome).trim().split(/\s+/).filter(Boolean)
  return partes
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

export function textoResponsavel(chamado, usuarioId) {
  if (!chamado.responsavelId) return 'Sem responsável'
  if (chamado.responsavelId === usuarioId) return 'Responsável: você'
  return `Responsável: ${chamado.responsavelNome}`
}

export function detalhesDoChamado(chamado, usuarioId, mostrarAutor) {
  const detalhes = [formatarData(chamado.criadoEm)]

  if (mostrarAutor) {
    detalhes.push(`Aberto por ${chamado.autorNome}`)
  }

  detalhes.push(textoResponsavel(chamado, usuarioId))
  return detalhes
}
