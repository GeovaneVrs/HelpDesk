import { useCallback, useEffect, useRef, useState } from 'react'

export function useRecurso(carregar) {
  const requisicaoAtual = useRef(0)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  const recarregar = useCallback(async () => {
    const requisicao = ++requisicaoAtual.current
    setCarregando(true)
    setErro(null)
    try {
      const resultado = await carregar()
      if (requisicao === requisicaoAtual.current) setDados(resultado)
    } catch (erroCarregamento) {
      if (requisicao === requisicaoAtual.current) setErro(erroCarregamento)
    } finally {
      if (requisicao === requisicaoAtual.current) setCarregando(false)
    }
  }, [carregar])

  useEffect(() => {
    recarregar()
    return () => {
      requisicaoAtual.current += 1
    }
  }, [recarregar])

  return { dados, carregando, erro, recarregar }
}
