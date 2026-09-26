/*
  Mensagens da conversa de um chamado.
  Hoje ficam no navegador. Na AV2, troque por chamadas à API.
*/

import { CHAVES, gravarLista, lerLista } from '../dados/armazenamento'
import { obterChamado, podeConversar } from './chamados'

function porMaisAntiga(a, b) {
  return new Date(a.criadoEm) - new Date(b.criadoEm)
}

export function listarMensagens(chamadoId) {
  return lerLista(CHAVES.mensagens)
    .filter((mensagem) =>
      mensagem &&
      mensagem.chamadoId === chamadoId &&
      typeof mensagem.texto === 'string' &&
      typeof mensagem.autorId === 'string',
    )
    .sort(porMaisAntiga)
}

export function enviarMensagem({ chamadoId, autor, texto }) {
  const chamado = obterChamado(chamadoId)
  if (!podeConversar(chamado, autor)) {
    return { ok: false, erro: 'Você não participa desta conversa.' }
  }

  const limpo = texto.trim()
  if (limpo.length < 1) return { ok: false, erro: 'Escreva uma mensagem.' }
  if (limpo.length > 500) return { ok: false, erro: 'A mensagem pode ter no máximo 500 letras.' }

  const nova = {
    id: crypto.randomUUID(),
    chamadoId,
    autorId: autor.id,
    autorNome: autor.nome,
    texto: limpo,
    criadoEm: new Date().toISOString(),
  }

  gravarLista(CHAVES.mensagens, [...lerLista(CHAVES.mensagens), nova])
  return { ok: true, mensagem: nova }
}
