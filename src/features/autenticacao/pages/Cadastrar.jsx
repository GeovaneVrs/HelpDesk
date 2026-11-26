import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '../../../components/ui/Botao'
import { CampoTexto } from '../../../components/ui/CampoTexto'
import { EstadoVazio } from '../../../components/ui/EstadoVazio'
import { Marca } from '../../../components/ui/Marca'
import { useRecurso } from '../../../hooks/useRecurso'
import { useTitulo } from '../../../hooks/useTitulo'
import { mensagemDeErro } from '../../../services/api'
import { departamentosApi } from '../../../services/departamentos'
import { usuariosApi } from '../../../services/usuarios'

export function Cadastrar() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [matricula, setMatricula] = useState('')
  const [ocupacao, setOcupacao] = useState('')
  const [departamentoId, setDepartamentoId] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const carregarDepartamentos = useCallback(
    () => departamentosApi.listar({ apenasAtivos: true }),
    [],
  )
  const departamentos = useRecurso(carregarDepartamentos)
  useTitulo('Criar cadastro')

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral('')
    setErros({})
    const novosErros = {}
    if (new TextEncoder().encode(senha).length > 72) {
      novosErros.password = 'A senha deve ter no máximo 72 bytes UTF-8.'
    }
    if (!departamentoId) novosErros.departamentoId = 'Selecione um departamento.'
    if (Object.keys(novosErros).length) {
      setErros(novosErros)
      return
    }

    setEnviando(true)
    try {
      await usuariosApi.cadastrar({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
        cpf: cpf.trim() || null,
        matricula: matricula.trim() || null,
        ocupacao: ocupacao.trim() || null,
        departamentoId: Number(departamentoId),
      })
      setSucesso(true)
    } catch (erroCadastro) {
      setErroGeral(mensagemDeErro(erroCadastro))
      setErros(erroCadastro.fields || {})
    } finally {
      setEnviando(false)
    }
  }

  function aoDigitar(definir) {
    return (evento) => {
      definir(evento.target.value)
      setErroGeral('')
      setErros({})
    }
  }

  return (
    <main className="auth">
      <section className="auth-cartao">
        <Marca />
        <p className="equipe">Equipe Rocket</p>
        <h1>Criar cadastro</h1>
        <p className="subtitulo">Crie uma conta de solicitante para acessar o sistema.</p>

        {sucesso ? (
          <>
            <p className="banner banner-ok" role="status">Cadastro realizado. Agora entre com seu e-mail e senha.</p>
            <p className="troca-tela"><Link to="/entrar">Ir para entrar</Link></p>
          </>
        ) : (
          <>
            {erroGeral ? <p className="banner" role="alert">{erroGeral}</p> : null}
            {departamentos.erro ? (
              <EstadoVazio
                titulo="Não foi possível carregar os departamentos"
                texto={mensagemDeErro(departamentos.erro)}
                acao={<Botao type="button" variante="secundario" onClick={departamentos.recarregar}>Tentar novamente</Botao>}
              />
            ) : null}
            {!departamentos.erro ? (
              <form onSubmit={enviar} noValidate>
                <CampoTexto
                  rotulo="Nome completo"
                  autoComplete="name"
                  maxLength={150}
                  required
                  value={nome}
                  onChange={aoDigitar(setNome)}
                  erro={erros.name}
                />
                <CampoTexto
                  rotulo="E-mail"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={aoDigitar(setEmail)}
                  erro={erros.email}
                />
                <CampoTexto
                  rotulo="Senha"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={72}
                  required
                  value={senha}
                  onChange={aoDigitar(setSenha)}
                  erro={erros.password}
                  dica="Mínimo de 6 caracteres."
                />
                <CampoTexto
                  rotulo="CPF (opcional)"
                  maxLength={14}
                  value={cpf}
                  onChange={aoDigitar(setCpf)}
                  erro={erros.cpf}
                />
                <CampoTexto
                  rotulo="Matrícula (opcional)"
                  maxLength={30}
                  value={matricula}
                  onChange={aoDigitar(setMatricula)}
                  erro={erros.matricula}
                />
                <CampoTexto
                  rotulo="Ocupação (opcional)"
                  maxLength={100}
                  value={ocupacao}
                  onChange={aoDigitar(setOcupacao)}
                  erro={erros.ocupacao}
                />
                <div className="campo">
                  <label htmlFor="departamentoId">Departamento</label>
                  <select
                    id="departamentoId"
                    className="entrada"
                    required
                    value={departamentoId}
                    onChange={aoDigitar(setDepartamentoId)}
                  >
                    <option value="">Selecione</option>
                    {(departamentos.dados || []).map((departamento) => (
                      <option key={departamento.id} value={departamento.id}>{departamento.nome}</option>
                    ))}
                  </select>
                  {erros.departamentoId ? <p className="mensagem-erro">{erros.departamentoId}</p> : null}
                </div>
                <Botao bloco type="submit" disabled={enviando || departamentos.carregando}>
                  {enviando ? 'Criando conta...' : 'Criar conta'}
                </Botao>
              </form>
            ) : null}
            <p className="troca-tela">
              Já tem conta? <Link to="/entrar">Entrar</Link>
            </p>
          </>
        )}
      </section>
    </main>
  )
}
