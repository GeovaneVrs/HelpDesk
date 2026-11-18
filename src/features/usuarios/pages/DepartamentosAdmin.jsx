import { useCallback, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { departamentosApi } from '../../../services/departamentos'
import { mensagemDeErro } from '../../../services/api'

function CartaoDepartamento({ departamento, executar, carregando }) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(departamento.nome)
  const [descricao, setDescricao] = useState(departamento.descricao || '')
  return (
    <article className="chamado" key={departamento.id}>
      {editando ? (
        <div className="config-grade">
          <CampoTexto rotulo="Nome" value={nome} onChange={(evento) => setNome(evento.target.value)} />
          <CampoTexto rotulo="Descrição" multilinha value={descricao} onChange={(evento) => setDescricao(evento.target.value)} />
        </div>
      ) : (
        <>
          <div className="chamado-topo"><h3>{departamento.nome}</h3><span className="selo">{departamento.ativo === false ? 'Inativo' : 'Ativo'}</span></div>
          <p>{departamento.descricao || 'Sem descrição.'}</p>
        </>
      )}
      <div className="novo-acoes">
        {editando ? (
          <>
            <Botao type="button" disabled={carregando || !nome.trim()} onClick={async () => {
              const sucesso = await executar(() => departamentosApi.atualizar(departamento.id, { nome: nome.trim(), descricao: descricao.trim() }))
              if (sucesso) setEditando(false)
            }}>Salvar</Botao>
            <Botao type="button" variante="secundario" disabled={carregando} onClick={() => { setNome(departamento.nome); setDescricao(departamento.descricao || ''); setEditando(false) }}>Cancelar</Botao>
          </>
        ) : <Botao type="button" variante="secundario" disabled={carregando} onClick={() => setEditando(true)}>Editar</Botao>}
        <Botao type="button" variante="secundario" disabled={carregando} onClick={() => executar(() => departamento.ativo === false ? departamentosApi.ativar(departamento.id) : departamentosApi.desativar(departamento.id))}>
          {departamento.ativo === false ? 'Ativar' : 'Desativar'}
        </Botao>
      </div>
    </article>
  )
}

export function DepartamentosAdmin() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [salvando, setSalvando] = useState(false)
  const carregar = useCallback(() => departamentosApi.listar(), [])
  const { dados: departamentos, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Departamentos')

  async function criar(evento) {
    evento.preventDefault()
    setErroAcao('')
    setSalvando(true)
    try {
      await departamentosApi.criar({ nome: nome.trim(), descricao: descricao.trim() })
      setNome('')
      setDescricao('')
      await recarregar()
    } catch (falha) {
      setErroAcao(mensagemDeErro(falha))
    } finally {
      setSalvando(false)
    }
  }

  async function executar(acao) {
    setErroAcao('')
    setSalvando(true)
    try {
      await acao()
      await recarregar()
      return true
    } catch (falha) {
      setErroAcao(mensagemDeErro(falha))
      return false
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <header className="cabecalho-pagina"><div><span className="sobretitulo">ADMINISTRAÇÃO</span><h1>Departamentos</h1><p className="subtitulo">Cadastre e mantenha os departamentos disponíveis no sistema.</p></div></header>
      <form className="novo-cartao config-cartao" onSubmit={criar}>
        <h2>Novo departamento</h2>
        {erroAcao ? <p className="mensagem-erro" role="alert">{erroAcao}</p> : null}
        <CampoTexto rotulo="Nome" value={nome} onChange={(evento) => setNome(evento.target.value)} maxLength={100} required />
        <CampoTexto rotulo="Descrição" multilinha value={descricao} onChange={(evento) => setDescricao(evento.target.value)} maxLength={500} />
        <div className="novo-acoes"><Botao type="submit" disabled={salvando || !nome.trim()}>{salvando ? 'Salvando...' : 'Criar departamento'}</Botao></div>
      </form>
      <section className="chamados-secao">
        <h2>Departamentos cadastrados</h2>
        <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
        {!carregando && !erro && (!departamentos || departamentos.length === 0) ? <EstadoVazio titulo="Nenhum departamento" texto="Cadastre o primeiro departamento pelo formulário acima." /> : null}
        {departamentos?.length > 0 ? <div className="lista">{departamentos.map((departamento) => <CartaoDepartamento key={departamento.id} departamento={departamento} executar={executar} carregando={salvando} />)}</div> : null}
      </section>
    </>
  )
}
