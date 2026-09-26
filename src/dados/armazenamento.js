/*
  Único arquivo que conversa com o localStorage.
  É o "banco" da AV1: os dados ficam neste navegador.

  Na AV2 a equipe troca os serviços (pasta servicos)
  por chamadas à API Spring Boot. Este arquivo deixa de ser usado.
*/

import { chamadosExemplo, mensagensExemplo, usuariosExemplo } from './exemplo'

export const CHAVES = {
  usuarios: 'helpdesk.usuarios',
  chamados: 'helpdesk.chamados',
  sessao: 'helpdesk.sessao',
  mensagens: 'helpdesk.mensagens',
}

export function lerLista(chave) {
  try {
    const texto = localStorage.getItem(chave)
    if (!texto) return []
    const valor = JSON.parse(texto)
    return Array.isArray(valor) ? valor : []
  } catch {
    return []
  }
}

export function gravarLista(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista, null, 2))
}

export function lerObjeto(chave) {
  try {
    const texto = localStorage.getItem(chave)
    if (!texto) return null
    const valor = JSON.parse(texto)
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null
    return valor
  } catch {
    return null
  }
}

export function gravarObjeto(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor, null, 2))
}

export function apagar(chave) {
  localStorage.removeItem(chave)
}

export function prepararDados() {
  if (localStorage.getItem(CHAVES.usuarios)) {
    if (!localStorage.getItem(CHAVES.mensagens)) {
      gravarLista(CHAVES.mensagens, mensagensExemplo)
    }
    return
  }
  gravarLista(CHAVES.usuarios, usuariosExemplo)
  gravarLista(CHAVES.chamados, chamadosExemplo)
  gravarLista(CHAVES.mensagens, mensagensExemplo)
}

export function restaurarExemplo() {
  gravarLista(CHAVES.usuarios, usuariosExemplo)
  gravarLista(CHAVES.chamados, chamadosExemplo)
  gravarLista(CHAVES.mensagens, mensagensExemplo)
  apagar(CHAVES.sessao)
}
