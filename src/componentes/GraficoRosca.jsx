/*
  Gráfico de rosca feito só com SVG, sem biblioteca.
  Cada fatia é um círculo com contorno tracejado:
  o traço tem o tamanho da fatia e o espaço vazio completa a volta.
*/

const CENTRO = 84
const RAIO = 60
const ESPESSURA = 18
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export function GraficoRosca({ atribuidos, semResponsavel }) {
  const total = atribuidos + semResponsavel
  const proporcao = total === 0 ? 0 : atribuidos / total

  const tamanhoAtribuido = CIRCUNFERENCIA * proporcao
  const tamanhoLivre = CIRCUNFERENCIA - tamanhoAtribuido

  // O SVG começa a desenhar o círculo às 3 horas. Girar -90° leva o início para o topo.
  // A segunda fatia gira mais um pouco, para começar onde a primeira termina.
  const giroAtribuido = -90
  const giroLivre = -90 + proporcao * 360

  return (
    <svg
      className="donut"
      viewBox="0 0 168 168"
      role="img"
      aria-label={`${atribuidos} de ${total} chamados com responsável`}
    >
      <circle
        cx={CENTRO} cy={CENTRO} r={RAIO}
        fill="none" stroke="var(--track-donut)" strokeWidth={ESPESSURA}
      />

      {tamanhoAtribuido > 0 ? (
        <circle
          className="donut-arco"
          cx={CENTRO} cy={CENTRO} r={RAIO}
          fill="none" stroke="#3d74ea" strokeWidth={ESPESSURA}
          strokeDasharray={`${tamanhoAtribuido} ${CIRCUNFERENCIA}`}
          transform={`rotate(${giroAtribuido} ${CENTRO} ${CENTRO})`}
          style={{ '--volta': `${tamanhoAtribuido}px` }}
        />
      ) : null}

      {tamanhoLivre > 0 ? (
        <circle
          className="donut-arco"
          cx={CENTRO} cy={CENTRO} r={RAIO}
          fill="none" stroke="#e2a33c" strokeWidth={ESPESSURA}
          strokeDasharray={`${tamanhoLivre} ${CIRCUNFERENCIA}`}
          transform={`rotate(${giroLivre} ${CENTRO} ${CENTRO})`}
          style={{ '--volta': `${tamanhoLivre}px` }}
        />
      ) : null}

      <text x={CENTRO} y={CENTRO + 4} textAnchor="middle" className="donut-numero">{total}</text>
      <text x={CENTRO} y={CENTRO + 22} textAnchor="middle" className="donut-rotulo">chamados</text>
    </svg>
  )
}
