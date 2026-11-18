const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
  : import.meta.env.DEV
    ? '/api'
    : 'http://localhost:8080/api'
const TOKEN_KEY = 'helpdesk.token'
const USER_KEY = 'helpdesk.usuario'

export class ApiError extends Error {
  constructor(response, body) {
    super(body?.mensagem || body?.message || `A API respondeu com HTTP ${response.status}.`)
    this.name = 'ApiError'
    this.status = response.status
    this.fields = body?.campos || {}
    this.code = body?.erro || ''
  }
}

export const sessaoApi = {
  lerToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  lerUsuario() {
    const usuario = localStorage.getItem(USER_KEY)
    if (!usuario) return null
    try {
      return JSON.parse(usuario)
    } catch {
      this.limpar()
      return null
    }
  },
  salvar({ token, usuario }) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(usuario))
  },
  salvarUsuario(usuario) {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario))
  },
  limpar() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

export async function requisitar(caminho, { headers: cabecalhos = {}, ...opcoes } = {}) {
  const token = sessaoApi.lerToken()
  const headers = new Headers(cabecalhos)
  if (opcoes.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers })
  if (resposta.status === 401 && token) {
    sessaoApi.limpar()
    window.dispatchEvent(new Event('helpdesk:sessao-expirada'))
  }

  if (resposta.status === 204) return null

  const texto = await resposta.text()
  let corpo = null
  if (texto) {
    try {
      corpo = JSON.parse(texto)
    } catch {
      if (resposta.ok) {
        throw new Error('A API retornou uma resposta que não é JSON válido.')
      }
    }
  }

  if (!resposta.ok) throw new ApiError(resposta, corpo)
  return corpo
}

export const api = {
  get: (caminho, opcoes) => requisitar(caminho, { ...opcoes, method: 'GET' }),
  post: (caminho, dados, opcoes) =>
    requisitar(caminho, {
      ...opcoes,
      method: 'POST',
      ...(dados === undefined ? {} : { body: JSON.stringify(dados) }),
    }),
  put: (caminho, dados, opcoes) =>
    requisitar(caminho, { ...opcoes, method: 'PUT', body: JSON.stringify(dados) }),
  patch: (caminho, dados, opcoes) =>
    requisitar(caminho, {
      ...opcoes,
      method: 'PATCH',
      ...(dados === undefined ? {} : { body: JSON.stringify(dados) }),
    }),
}

export function mensagemDeErro(erro) {
  if (erro instanceof ApiError) {
    const campos = Object.values(erro.fields).filter(Boolean)
    return campos.length ? `${erro.message} ${campos.join(' ')}` : erro.message
  }
  return erro instanceof Error ? erro.message : 'Não foi possível concluir a operação.'
}
