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

// Transforma milissegundos em texto curto: "45 min", "1h 30min", "2d 4h".
export function formatarDuracao(ms) {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return '—'

  const minutos = Math.round(ms / 60000)
  if (minutos < 1) return 'menos de 1 min'
  if (minutos < 60) return `${minutos} min`

  const horas = Math.floor(minutos / 60)
  if (horas < 24) {
    const restoMinutos = minutos % 60
    return restoMinutos ? `${horas}h ${restoMinutos}min` : `${horas}h`
  }

  const dias = Math.floor(horas / 24)
  const restoHoras = horas % 24
  return restoHoras ? `${dias}d ${restoHoras}h` : `${dias}d`
}
