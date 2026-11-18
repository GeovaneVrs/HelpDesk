import { useCallback, useState } from 'react'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { EstadoApi } from '../../../components/ui/EstadoApi'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { usuariosApi } from '../../../services/usuarios'
import { mensagemDeErro } from '../../../services/api'
import { nomePapel } from '../../chamados/dominio'

function CartaoUsuarioAdmin({ usuario, executar, carregando }) {
  const [editando, setEditando] = useState(false)
  const [name, setName] = useState(usuario.name)
  const [email, setEmail] = useState(usuario.email)
  return (
    <article className="pessoa" key={usuario.id}>
      <div className="pessoa-cabecalho">
        <div>
          {editando ? (
            <div className="config-grade">
              <CampoTexto rotulo="Nome" value={name} onChange={(evento) => setName(evento.target.value)} />
              <CampoTexto rotulo="E-mail" type="email" value={email} onChange={(evento) => setEmail(evento.target.value)} />
            </div>
          ) : <><h2>{usuario.name}</h2><p>{usuario.email}</p></>}
        </div>
        <span className="selo">{nomePapel(usuario.role)}</span>
      </div>
      <p>{usuario.departamentoNome || 'Sem departamento'} · {usuario.ativo === false ? 'Desativado' : 'Ativo'}</p>
      <div className="novo-acoes">
        <label className="campo">
          <span>Papel</span>
          <select className="entrada" value={usuario.role} disabled={carregando} onChange={(evento) => executar(() => usuariosApi.alterarRole(usuario.id, evento.target.value))}>
            <option value="USER">Solicitante</option>
            <option value="TECHNICIAN">Técnico</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </label>
        {editando ? (
          <>
            <Botao type="button" disabled={carregando || !name.trim() || !email.trim()} onClick={async () => {
              await executar(() => usuariosApi.atualizar(usuario.id, { name: name.trim(), email: email.trim() }))
              setEditando(false)
            }}>Salvar perfil</Botao>
            <Botao type="button" variante="secundario" disabled={carregando} onClick={() => { setName(usuario.name); setEmail(usuario.email); setEditando(false) }}>Cancelar</Botao>
          </>
        ) : <Botao type="button" variante="secundario" disabled={carregando} onClick={() => setEditando(true)}>Editar perfil</Botao>}
        {usuario.ativo === false
          ? <Botao type="button" variante="secundario" disabled={carregando} onClick={() => executar(() => usuariosApi.ativar(usuario.id))}>Ativar</Botao>
          : <Botao type="button" variante="secundario" disabled={carregando} onClick={() => executar(() => usuariosApi.desativar(usuario.id))}>Desativar</Botao>}
      </div>
    </article>
  )
}

export function UsuariosAdmin() {
  const [erroAcao, setErroAcao] = useState('')
  const [carregandoAcao, setCarregandoAcao] = useState(false)
  const carregar = useCallback(() => usuariosApi.listar(), [])
  const { dados: usuarios, carregando, erro, recarregar } = useRecurso(carregar)
  useTitulo('Administração de usuários')

  async function executar(acao) {
    setErroAcao('')
    setCarregandoAcao(true)
    try {
      await acao()
      await recarregar()
    } catch (falha) {
      setErroAcao(mensagemDeErro(falha))
    } finally {
      setCarregandoAcao(false)
    }
  }

  return (
    <>
      <header className="cabecalho-pagina"><div><span className="sobretitulo">ADMINISTRAÇÃO</span><h1>Usuários</h1><p className="subtitulo">Gerencie contas, papéis de acesso e status dos usuários.</p></div></header>
      {erroAcao ? <p className="mensagem-erro" role="alert">{erroAcao}</p> : null}
      <EstadoApi carregando={carregando} erro={erro} recarregar={recarregar} />
      {!carregando && !erro && (!usuarios || usuarios.length === 0) ? <EstadoVazio titulo="Nenhum usuário cadastrado" texto="Quando houver usuários, eles aparecerão nesta lista." /> : null}
      {usuarios?.length > 0 ? (
        <section className="chamados-secao" aria-label="Contas de usuário">
          <div className="pessoas">
            {usuarios.map((usuario) => <CartaoUsuarioAdmin key={usuario.id} usuario={usuario} executar={executar} carregando={carregandoAcao} />)}
          </div>
        </section>
      ) : null}
    </>
  )
}
