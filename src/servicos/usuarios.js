/*
  Porta dos usuários.
  Hoje grava no navegador. Na AV2, o miolo destas funções
  passa a chamar a API. As telas podem continuar iguais.

  A sessão guarda só o id. A senha não vai para a memória da tela.
*/

import { CHAVES, apagar, gravarLista, gravarObjeto, lerLista, lerObjeto } from '../dados/armazenamento'

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function semSenha(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    papel: usuario.papel,
  }
}

function buscarPorEmail(email) {
  const normalizado = email.trim().toLowerCase()
  return lerLista(CHAVES.usuarios).find((usuario) => usuario.email === normalizado) || null
}

function validarCadastro({ nome, email, senha, confirmar, papel }) {
  const erros = {}
  const nomeLimpo = nome.trim()
  const emailLimpo = email.trim().toLowerCase()

  if (nomeLimpo.length < 3) erros.nome = 'Informe seu nome completo.'
  if (nomeLimpo.length > 80) erros.nome = 'Use um nome com até 80 letras.'

  if (!emailValido(emailLimpo)) erros.email = 'Informe um e-mail válido.'
  else if (buscarPorEmail(emailLimpo)) erros.email = 'Este e-mail já está cadastrado.'

  if (senha.length < 6) erros.senha = 'A senha precisa ter pelo menos 6 caracteres.'
  if (senha !== confirmar) erros.confirmar = 'As senhas não são iguais.'

  if (papel !== 'solicitante' && papel !== 'responsavel') {
    erros.papel = 'Escolha se você abre ou atende chamados.'
  }

  return erros
}

export function cadastrar({ nome, email, senha, confirmar, papel }) {
  const erros = validarCadastro({ nome, email, senha, confirmar, papel })
  if (Object.keys(erros).length > 0) return { ok: false, erros }

  const novo = {
    id: crypto.randomUUID(),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
    papel,
    criadoEm: new Date().toISOString(),
  }

  gravarLista(CHAVES.usuarios, [...lerLista(CHAVES.usuarios), novo])
  gravarObjeto(CHAVES.sessao, { id: novo.id })

  return { ok: true, usuario: semSenha(novo) }
}

export function entrar(email, senha) {
  const erros = {}
  if (!email.trim()) erros.email = 'Informe o e-mail.'
  if (!senha) erros.senha = 'Informe a senha.'
  if (Object.keys(erros).length > 0) return { ok: false, erros }

  const usuario = buscarPorEmail(email)
  if (!usuario || usuario.senha !== senha) {
    return { ok: false, erros: { geral: 'E-mail ou senha não conferem.' } }
  }

  gravarObjeto(CHAVES.sessao, { id: usuario.id })
  return { ok: true, usuario: semSenha(usuario) }
}

export function obterSessao() {
  const sessao = lerObjeto(CHAVES.sessao)
  if (!sessao?.id) return null

  const usuario = lerLista(CHAVES.usuarios).find((item) => item.id === sessao.id)
  if (!usuario) {
    apagar(CHAVES.sessao)
    return null
  }

  return semSenha(usuario)
}

export function encerrarSessao() {
  apagar(CHAVES.sessao)
}
