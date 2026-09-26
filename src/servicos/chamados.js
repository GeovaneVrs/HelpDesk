/*
  Porta dos chamados.
  Hoje lê e grava no navegador. Na AV2, troque o miolo
  por chamadas à API Spring Boot. As telas podem continuar iguais.
*/

import { CHAVES, gravarLista, lerLista } from '../dados/armazenamento'

// Na AV1 o chamado nasce sempre "Aberto".
// O controle de status entra na AV2.
const STATUS_INICIAL = 'Aberto'

function porMaisRecente(a, b) {
  return new Date(b.criadoEm) - new Date(a.criadoEm)
}

function validarChamado({ titulo, descricao }) {
  const erros = {}
  if (titulo.trim().length < 5) erros.titulo = 'Escreva um título com pelo menos 5 letras.'
  if (descricao.trim().length < 10) erros.descricao = 'Descreva o problema com pelo menos 10 letras.'
  return erros
}

export function listarChamados() {
  return lerLista(CHAVES.chamados)
    .filter((chamado) =>
      chamado &&
      typeof chamado.id === 'string' &&
      typeof chamado.titulo === 'string' &&
      typeof chamado.descricao === 'string' &&
      typeof chamado.autorId === 'string',
    )
    .sort(porMaisRecente)
}

export function listarMeusChamados(autorId) {
  return listarChamados().filter((chamado) => chamado.autorId === autorId)
}

export function obterChamado(id) {
  return listarChamados().find((chamado) => chamado.id === id) || null
}

export function podeConversar(chamado, usuario) {
  if (!chamado || !usuario) return false
  if (usuario.papel === 'solicitante') return chamado.autorId === usuario.id
  if (usuario.papel === 'responsavel') return chamado.responsavelId === usuario.id
  return false
}

export function criarChamado({ titulo, descricao, autor }) {
  if (autor?.papel !== 'solicitante') {
    return { ok: false, erros: { geral: 'A equipe de suporte atende chamados e não pode abrir um.' } }
  }

  const erros = validarChamado({ titulo, descricao })
  if (Object.keys(erros).length > 0) return { ok: false, erros }

  const novo = {
    id: crypto.randomUUID(),
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    autorId: autor.id,
    autorNome: autor.nome,
    responsavelId: null,
    responsavelNome: null,
    status: STATUS_INICIAL,
    criadoEm: new Date().toISOString(),
  }

  gravarLista(CHAVES.chamados, [...lerLista(CHAVES.chamados), novo])
  return { ok: true, chamado: novo }
}

export function assumirChamado(chamadoId, responsavel) {
  const chamados = lerLista(CHAVES.chamados)
  const atual = chamados.find((chamado) => chamado.id === chamadoId)

  if (!atual) return { ok: false, erro: 'Chamado não encontrado.' }
  if (atual.responsavelId) return { ok: false, erro: 'Este chamado já tem responsável.' }

  const atualizados = chamados.map((chamado) => {
    if (chamado.id !== chamadoId) return chamado
    return {
      ...chamado,
      responsavelId: responsavel.id,
      responsavelNome: responsavel.nome,
      assumidoEm: new Date().toISOString(),
    }
  })

  gravarLista(CHAVES.chamados, atualizados)
  return { ok: true }
}
