/*
  Pessoas com os números de atendimento de cada uma.
  Junta usuários e chamados para as telas Solicitantes e Equipe.

  Hoje calcula tudo no navegador. Na AV2, cada função pode virar
  uma chamada à API (ex.: GET /solicitantes). As telas continuam iguais.
*/

import { listarChamados } from './chamados'
import { listarUsuarios } from './usuarios'

function maisRecente(datas) {
  const validas = datas.filter(Boolean)
  if (validas.length === 0) return null
  return validas.reduce((a, b) => (new Date(b) > new Date(a) ? b : a))
}

// Quem abre chamados, com o histórico de cada um.
export function listarSolicitantes() {
  const chamados = listarChamados()

  return listarUsuarios('solicitante').map((pessoa) => {
    const seus = chamados.filter((chamado) => chamado.autorId === pessoa.id)
    const aguardando = seus.filter((chamado) => !chamado.responsavelId).length

    return {
      ...pessoa,
      chamados: seus,
      total: seus.length,
      aguardando,
      emAtendimento: seus.length - aguardando,
      ultimoChamadoEm: maisRecente(seus.map((chamado) => chamado.criadoEm)),
    }
  })
}

// Quem atende, com a carga atual de cada um.
// Ordena de quem tem mais chamados para quem tem menos.
export function listarEquipe() {
  const chamados = listarChamados()

  return listarUsuarios('responsavel')
    .map((pessoa) => {
      const assumidos = chamados.filter((chamado) => chamado.responsavelId === pessoa.id)

      return {
        ...pessoa,
        chamados: assumidos,
        carga: assumidos.length,
        ultimoAssumidoEm: maisRecente(assumidos.map((chamado) => chamado.assumidoEm)),
      }
    })
    .sort((a, b) => b.carga - a.carga || a.nome.localeCompare(b.nome, 'pt-BR'))
}