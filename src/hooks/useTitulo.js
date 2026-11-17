import { useEffect } from 'react'

// Atualiza o texto da aba do navegador.
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = `${titulo} · Helpdesk`
  }, [titulo])
}
