import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Botao } from '../componentes/Botao'
import { CampoTexto } from '../componentes/CampoTexto'
import { useSessao } from '../contexto/Sessao'
import { useTitulo } from '../uteis/useTitulo'


export function Configuracoes() {
    useTitulo('Configurações')

    return (
        <div className="config">
            <header className="cabecalho-pagina">
                <div>
                    <span className="sobretitulo">SUA CONTA</span>
                    <h1>Configurações</h1>
                    <p className="subtitulo">Seus dados pessoais e as informações da sua conta.</p>
                </div>
            </header>

            <CartaoDadosPessoais />
            <CartaoDadosEmpresa />
        </div>
    )
}

function CartaoDadosPessoais() {
    const { usuario, atualizarPerfil } = useSessao()
    const [nome, setNome] = useState(usuario.nome)
    const [email, setEmail] = useState(usuario.email)
    const [erros, setErros] = useState({})
    const [salvo, setSalvo] = useState(false)

    const mudou = nome.trim() !== usuario.nome || email.trim().toLowerCase() !== usuario.email
    
    function salvar(evento) {
        evento.preventDefault()
        const resultado = atualizarPerfil({ nome, email })
        if(!resultado.ok) {
            setErros(resultado.erros)
            return
        }
        setNome(resultado.usuario.nome)
        setEmail(resultado.usuario.email)
        setSalvo(true)
    }

    function aoDigitar(definir) {
        return (evento) => {
            definir(evento.target.value)
            setErros({})
            setSalvo(false)
        }
    }

    return (
        <form className="novo-cartao config-cartao" onSubmit={salvar} noValidate>
            <div className="config-cabeca">
                <h2>Dados Pessoais</h2>
                <p className="subtitulo"> Como você aparece nos chamados e como entra no sistema.</p>
            </div>

            {erros.geral ? <p className="banner" role="alert">{erros.geral}</p> : null}
           {salvo ? <p className="banner banner-ok" role="status">Dados atualizados.</p> : null}

           <CampoTexto
                rotulo="Nome completo"
                autoComplete="name"
                maxLength={80}
                value={nome}
                onChange={aoDigitar(setNome)}
                erro={erros.nome}
            />

            <CampoTexto
                rotulo="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={aoDigitar(setEmail)}
                erro={erros.email}
                dica="É com este e-mail que você entra no sistema."    
            />

            <div className="novo-acoes">
                <Botao type="submit" disabled={!mudou}>Salvar alterações</Botao>
            </div>
        </form>
    )
}

        function CartaoDadosEmpresa() {
            const { usuario } = useSessao()
            const tipoConta = usuario.papel === 'responsavel' ? 'Equipe de suporte' : 'Solicitante'

            return (
                <section className="novo-cartao config-cartao" aria-labelledby="titulo-empresa">

                    <div className="config-cabeca">
                        <h2 id="titulo-empresa">Dados da empresa</h2>
                        <p className="config-trava">
                            <Lock size={14} strokeWidth={2} aria-hidden="true" />
                            Somente a administração pode alterar estes dados.
                        </p>
                    </div>

                    <div className="config-grade">
                        <CampoTexto rotulo="Tipo de conta" value={tipoConta} readOnly />
                        <CampoTexto rotulo="Cargo" value={usuario.cargo || 'Não informado'} readOnly />
                        <CampoTexto rotulo="Departamento" value={usuario.departamento || 'Não informado'} readOnly />
                    </div>
                </section>
    )
}