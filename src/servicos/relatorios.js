/*
  Números da tela de Relatórios.
  Na AV2, esta função pode virar uma chamada à API (ex.: GET /relatorios?dias=7).
*/
import { listarChamados } from './chamados'

const UM_DIA = 24 * 60 * 60 * 1000

// Média de uma lista de números. Lista vazia não tem média: devolve null.
function media(valores) {
  if (valores.length === 0) return null
  return valores.reduce((soma, valor) => soma + valor, 0) / valores.length
}

// Quanto tempo (em milissegundos) o chamado esperou até alguém assumir.
function tempoAteAssumir(chamado) {
  return new Date(chamado.assumidoEm) - new Date(chamado.criadoEm)
}

// dias: 7, 30... ou null para considerar todos os chamados.
export function gerarRelatorio(dias = null) {
  const agora = Date.now()
  const chamados = listarChamados().filter(
    (chamado) => !dias || agora - new Date(chamado.criadoEm) <= dias * UM_DIA,
  )

  const atribuidos = chamados.filter((chamado) => chamado.responsavelId).length
  const assumidos = chamados.filter((chamado) => chamado.responsavelId && chamado.assumidoEm)
  const livres = chamados.filter((chamado) => !chamado.responsavelId)

  // Agrupa os tempos por responsável: { 'usuario-carlos': { nome, tempos: [...] }, ... }
  const grupos = {}
  for (const chamado of assumidos) {
    if (!grupos[chamado.responsavelId]) {
      grupos[chamado.responsavelId] = { nome: chamado.responsavelNome, tempos: [] }
    }
    grupos[chamado.responsavelId].tempos.push(tempoAteAssumir(chamado))
  }

  const porResponsavel = Object.entries(grupos)
    .map(([id, grupo]) => ({
      id,
      nome: grupo.nome,
      quantidade: grupo.tempos.length,
      media: media(grupo.tempos),
    }))
    .sort((a, b) => a.media - b.media)

  return {
    total: chamados.length,
    atribuidos,
    semResponsavel: chamados.length - atribuidos,
    tempoMedio: media(assumidos.map(tempoAteAssumir)),
    esperaAtual: media(livres.map((chamado) => agora - new Date(chamado.criadoEm))),
    porResponsavel,
  }
}
