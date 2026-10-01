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

// O papel serve para filtrar por "solicitante" ou "responsável"
export function listarUsuarios(papel) {
  return lerLista(CHAVES.usuarios)
    .filter((usuario) =>
      usuario &&
      typeof usuario.id === 'string' &&
      typeof usuario.nome === 'string' &&
      (!papel || usuario.papel === papel),
    )
    .map((usuario) => ({ ...semSenha(usuario), criadoEm: usuario.criadoEm }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

/*
  Atualiza nome e e-mail de quem está logado.
  O nome também aparece copiado dentro de chamados e mensagens
  (autorNome, responsavelNome). Por isso atualizamos as cópias aqui,
  senão os chamados antigos continuariam com o nome velho.
*/
// Só nome e e-mail são lidos dos dados recebidos. Mesmo que alguém envie
// cargo, departamento ou papel, esses campos são ignorados: quem define
// isso é a administração, não o próprio usuário.
export function atualizarPerfil(id, { nome, email }) {
  const usuarios = lerLista(CHAVES.usuarios)
  const atual = usuarios.find((usuario) => usuario.id === id)
  if (!atual) return { ok: false, erros: { geral: 'Conta não encontrada. Entre novamente.' } }

  const nomeLimpo = nome.trim()
  const emailLimpo = email.trim().toLowerCase()
  const erros = {}

  if (nomeLimpo.length < 3) erros.nome = 'Informe seu nome completo.'
  if (nomeLimpo.length > 80) erros.nome = 'Use um nome com até 80 letras.'

  const donoDoEmail = buscarPorEmail(emailLimpo)
  if (!emailValido(emailLimpo)) erros.email = 'Informe um e-mail válido.'
  else if (donoDoEmail && donoDoEmail.id !== id) erros.email = 'Este e-mail já está em uso por outra conta.'

  if (Object.keys(erros).length > 0) return { ok: false, erros }

  const atualizado = { ...atual, nome: nomeLimpo, email: emailLimpo }
  gravarLista(CHAVES.usuarios, usuarios.map((usuario) => (usuario.id === id ? atualizado : usuario)))

  if (nomeLimpo !== atual.nome) {
    const chamados = lerLista(CHAVES.chamados).map((chamado) => ({
      ...chamado,
      autorNome: chamado.autorId === id ? nomeLimpo : chamado.autorNome,
      responsavelNome: chamado.responsavelId === id ? nomeLimpo : chamado.responsavelNome,
    }))
    gravarLista(CHAVES.chamados, chamados)

    const mensagens = lerLista(CHAVES.mensagens).map((mensagem) =>
      mensagem.autorId === id ? { ...mensagem, autorNome: nomeLimpo } : mensagem,
    )
    gravarLista(CHAVES.mensagens, mensagens)
  }

  return { ok: true, usuario: semSenha(atualizado) }
}