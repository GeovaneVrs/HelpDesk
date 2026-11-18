import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { useAutenticacao } from '../../../contexto/Autenticacao'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { usuariosApi } from '../../../services/usuarios'
import { mensagemDeErro } from '../../../services/api'
import { formatarData } from '../../../utils/texto'
import { STATUS_CHAMADO, ROTULOS_STATUS, nomeStatus } from '../dominio'

export function Conversa() {
  const { id } = useParams()
  const { usuario } = useAutenticacao()
  const [texto, setTexto] = useState('')
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [executando, setExecutando] = useState(false)
  const carregar = useCallback(async () => {
    const [chamado, historico] = await Promise.all([
      chamadosApi.obter(id),
      chamadosApi.listarHistorico(id),
    ])
    return { chamado, historico }
  }, [id])
  const { dados, carregando, erro, recarregar } = useRecurso(carregar)
  const carregarTecnicos = useCallback(
    () => usuario.role === 'USER' ? Promise.resolve([]) : usuariosApi.listar('TECHNICIAN'),
    [usuario.role],
  )
  const { dados: tecnicos, erro: erroTecnicos } = useRecurso(carregarTecnicos)
  const chamado = dados?.chamado
  useTitulo(chamado?.titulo || 'Chamado')

  useEffect(() => {
    if (chamado) {
      setTitulo(chamado.titulo)
      setDescricao(chamado.descricao)
    }
  }, [chamado?.id, chamado?.titulo, chamado?.descricao])

  async function executar(acao) {
    setErroAcao('')
    setExecutando(true)
    try {
      await acao()
      await recarregar()
      return true
    } catch (erro) {
      setErroAcao(mensagemDeErro(erro))
      return false
    } finally {
      setExecutando(false)
    }
  }

  async function enviar(evento) {
    evento.preventDefault()
    if (!texto.trim()) {
      setErroAcao('Escreva uma mensagem antes de enviar.')
      return
    }
    const mensagem = texto.trim()
    if (await executar(() => chamadosApi.comentar(id, mensagem))) setTexto('')
  }

  async function salvarDetalhes(evento) {
    evento.preventDefault()
    if (titulo.trim().length < 5 || !descricao.trim()) {
      setErroAcao('Informe um título com pelo menos 5 caracteres e uma descrição.')
      return
    }
    const salvou = await executar(() => chamadosApi.atualizar(id, {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      categoria: chamado.categoria,
      prioridade: chamado.prioridade,
      departamentoId: chamado.departamentoId,
    }))
    if (salvou) setEditando(false)
  }

  const podeGerenciar = usuario.role === 'TECHNICIAN' || usuario.role === 'ADMIN'
  const historico = Array.isArray(dados?.historico) ? dados.historico : []

  return (
    <section className="conversa">
      <div className="conversa-painel">
        <header className="conversa-cabecalho">
          <Botao para="/chamados" variante="texto">← Chamados</Botao>
          <div className="conversa-titulo">
            <span className="sobretitulo">CONVERSA DO CHAMADO</span>
            <h1>{chamado?.titulo || 'Detalhes do chamado'}</h1>
            <p>{chamado?.descricao}</p>
          </div>
          {chamado ? (
            <div className="conversa-lado">
              <span className="selo">{nomeStatus(chamado.status)}</span>
              <p>{chamado.solicitanteNome || 'Solicitante'} · {chamado.tecnicoNome || 'Sem responsável'}</p>
              {podeGerenciar ? <Botao type="button" variante="texto" onClick={() => setEditando((atual) => !atual)}>{editando ? 'Cancelar edição' : 'Editar chamado'}</Botao> : null}
            </div>
          ) : null}
        </header>

        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {erroAcao ? <p className="mensagem-erro" role="alert">{erroAcao}</p> : null}
        {erroTecnicos ? <p className="mensagem-erro" role="alert">Não foi possível carregar a lista de técnicos: {mensagemDeErro(erroTecnicos)}</p> : null}

        {editando && chamado ? (
          <form className="novo-cartao config-cartao" onSubmit={salvarDetalhes}>
            <CampoTexto rotulo="Título" value={titulo} maxLength={100} onChange={(evento) => setTitulo(evento.target.value)} required />
            <CampoTexto rotulo="Descrição" multilinha value={descricao} maxLength={1000} onChange={(evento) => setDescricao(evento.target.value)} required />
            <div className="novo-acoes"><Botao type="submit" disabled={executando}>{executando ? 'Salvando...' : 'Salvar detalhes'}</Botao></div>
          </form>
        ) : null}

        {chamado && podeGerenciar ? (
          <div className="ferramentas">
            <div className="campo">
              <label htmlFor="status-chamado">Status</label>
              <select
                id="status-chamado"
                className="entrada"
                value={chamado.status}
                disabled={executando}
                onChange={(evento) => executar(() => chamadosApi.alterarStatus(id, evento.target.value))}
              >
                {STATUS_CHAMADO.map((status) => <option key={status} value={status}>{ROTULOS_STATUS[status]}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="tecnico-chamado">Técnico responsável</label>
              <select
                id="tecnico-chamado"
                className="entrada"
                value={chamado.tecnicoId || ''}
                disabled={executando || !tecnicos}
                onChange={(evento) => executar(() => chamadosApi.atribuirTecnico(id, evento.target.value ? Number(evento.target.value) : null))}
              >
                <option value="">Sem responsável</option>
                {(tecnicos || []).map((tecnico) => <option key={tecnico.id} value={tecnico.id}>{tecnico.name}</option>)}
              </select>
            </div>
          </div>
        ) : null}

        {chamado ? (
          <>
            <div className="mensagens" aria-live="polite">
              {historico.length === 0 ? (
                <p className="mensagens-vazias">Ainda não há mensagens ou atualizações neste chamado.</p>
              ) : historico.map((item, indice) => (
                <article className="mensagem" key={item.id ?? `${item.createdAt}-${indice}`}>
                  <div className="mensagem-cabecalho">
                    <strong>{item.usuarioNome || item.autorNome || 'Atualização'}</strong>
                    <time>{formatarData(item.createdAt || item.data)}</time>
                  </div>
                  <p>{item.mensagem || item.descricao || item.acao}</p>
                </article>
              ))}
            </div>
            <form className="conversa-form" onSubmit={enviar}>
              <CampoTexto
                id="mensagem"
                rotulo="Adicionar comentário"
                multilinha
                rows={3}
                maxLength={500}
                placeholder="Escreva uma mensagem"
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                extra={<span className="contador">{texto.trim().length}/500</span>}
              />
              <div className="conversa-enviar">
                <Botao type="submit" disabled={executando}>{executando ? 'Enviando...' : 'Enviar comentário'}</Botao>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </section>
  )
}
