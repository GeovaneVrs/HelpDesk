import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { chamadosApi } from '../../../services/chamados'
import { departamentosApi } from '../../../services/departamentos'
import { mensagemDeErro } from '../../../services/api'
import { CATEGORIAS_CHAMADO, PRIORIDADES_CHAMADO, ROTULOS_CATEGORIA, ROTULOS_PRIORIDADE } from '../dominio'

export function NovoChamado() {
  const navegar = useNavigate()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('OUTROS')
  const [prioridade, setPrioridade] = useState('MEDIA')
  const [departamentoId, setDepartamentoId] = useState('')
  const [erroEnvio, setErroEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)
  const carregarDepartamentos = useCallback(() => departamentosApi.listar({ apenasAtivos: true }), [])
  const { dados: departamentos, carregando, erro, recarregar } = useRecurso(carregarDepartamentos)
  useTitulo('Novo chamado')

  async function enviar(evento) {
    evento.preventDefault()
    setErroEnvio('')
    if (titulo.trim().length < 5 || descricao.trim().length < 10 || !departamentoId) {
      setErroEnvio('Preencha todos os campos obrigatórios. O título deve ter ao menos 5 caracteres e a descrição, 10.')
      return
    }

    setEnviando(true)
    try {
      const chamado = await chamadosApi.criar({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        categoria,
        prioridade,
        departamentoId: Number(departamentoId),
      })
      navegar(`/chamados/${chamado.id}`, { replace: true })
    } catch (erro) {
      setErroEnvio(mensagemDeErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="novo">
      <Botao para="/chamados" variante="texto">← Chamados</Botao>
      <div className="novo-grade">
        <header className="novo-intro">
          <span className="sobretitulo">Solicitação</span>
          <h1>Novo chamado</h1>
          <p className="subtitulo">Descreva o problema com clareza para o responsável entender o que precisa de atenção.</p>
          <ul className="novo-dicas">
            <li><strong>O que aconteceu</strong><span>O sintoma, a tela ou o equipamento.</span></li>
            <li><strong>Desde quando</strong><span>Se começou agora ou já se repete.</span></li>
            <li><strong>O que você tentou</strong><span>Informe o que já fez para resolver.</span></li>
          </ul>
        </header>

        <form className="novo-cartao" onSubmit={enviar} noValidate>
          {erroEnvio ? <p className="mensagem-erro" role="alert">{erroEnvio}</p> : null}
          <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
          <CampoTexto
            rotulo="Título"
            autoFocus
            maxLength={100}
            placeholder="Ex.: Computador não liga"
            value={titulo}
            extra={<span className="contador">{titulo.length}/100</span>}
            onChange={(evento) => setTitulo(evento.target.value)}
            required
          />
          <CampoTexto
            rotulo="Descrição"
            multilinha
            maxLength={1000}
            placeholder="Conte o que aconteceu, desde quando e o que você já tentou."
            value={descricao}
            extra={<span className="contador">{descricao.length}/1000</span>}
            onChange={(evento) => setDescricao(evento.target.value)}
            required
          />
          <div className="config-grade">
            <div className="campo">
              <label htmlFor="categoria">Categoria</label>
              <select id="categoria" className="entrada" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
                {CATEGORIAS_CHAMADO.map((valor) => <option key={valor} value={valor}>{ROTULOS_CATEGORIA[valor]}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="prioridade">Prioridade</label>
              <select id="prioridade" className="entrada" value={prioridade} onChange={(evento) => setPrioridade(evento.target.value)}>
                {PRIORIDADES_CHAMADO.map((valor) => <option key={valor} value={valor}>{ROTULOS_PRIORIDADE[valor]}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="departamento">Departamento</label>
              <select id="departamento" className="entrada" value={departamentoId} onChange={(evento) => setDepartamentoId(evento.target.value)} required disabled={carregando || !!erro}>
                <option value="">Selecione</option>
                {(departamentos || []).map((departamento) => <option key={departamento.id} value={departamento.id}>{departamento.nome}</option>)}
              </select>
            </div>
          </div>
          <p className="novo-nota">Quanto mais claro, mais rápido o atendimento começa.</p>
          <div className="novo-acoes">
            <Botao para="/chamados" variante="secundario">Cancelar</Botao>
            <Botao type="submit" disabled={enviando || carregando || !!erro}>{enviando ? 'Registrando...' : 'Registrar chamado'}</Botao>
          </div>
        </form>
      </div>
    </section>
  )
}
