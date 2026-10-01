import { formatarDuracao } from '../uteis/texto'

/*
  Barras horizontais de tempo.
  Azul: tempo médio que cada responsável levou para assumir.
  Âmbar: há quanto tempo, em média, os chamados sem responsável estão esperando.
  Todas as barras usam a mesma escala: a maior ocupa 100% do trilho.
*/
export function GraficoTempo({ porResponsavel, esperaAtual }) {
  const maior = Math.max(1, ...porResponsavel.map((pessoa) => pessoa.media), esperaAtual ?? 0)

  // Mínimo de 4% para uma barra muito pequena não sumir.
  function largura(valor) {
    return `${Math.max(4, (valor / maior) * 100)}%`
  }

  return (
    <>
      <ul className="tempo-lista">
        {porResponsavel.map((pessoa) => (
          <li className="tempo-item" key={pessoa.id}>
            <span className="tempo-nome">
              {pessoa.nome} ({pessoa.quantidade} {pessoa.quantidade === 1 ? 'chamado' : 'chamados'})
            </span>
            <strong>{formatarDuracao(pessoa.media)}</strong>
            <span className="tempo-trilho">
              <span className="tempo-resposta" style={{ width: largura(pessoa.media) }} />
            </span>
          </li>
        ))}

        {esperaAtual !== null ? (
          <li className="tempo-item">
            <span className="tempo-nome">Ainda sem responsável</span>
            <strong>{formatarDuracao(esperaAtual)}</strong>
            <span className="tempo-trilho">
              <span className="tempo-espera" style={{ width: largura(esperaAtual) }} />
            </span>
          </li>
        ) : null}
      </ul>

      <div className="grafico-legenda">
        <span><span className="ponto ponto-grafico-atribuido" />Média até assumir</span>
        <span><span className="ponto ponto-grafico-livre" />Espera de quem ainda aguarda</span>
      </div>
    </>
  )
}
