import { Botao } from './Botao'
import { EstadoVazio } from './EstadoVazio'
import { mensagemDeErro } from '../../services/api'

export function EstadoApi({ carregando, erro, recarregar }) {
  if (carregando) return <p className="estado-requisicao">Carregando dados...</p>
  if (!erro) return null

  return (
    <EstadoVazio
      titulo="Não foi possível carregar os dados"
      texto={mensagemDeErro(erro)}
      acao={recarregar ? (
        <Botao type="button" variante="secundario" onClick={recarregar}>Tentar novamente</Botao>
      ) : null}
    />
  )
}
