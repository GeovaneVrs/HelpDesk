import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

if (localStorage.getItem('helpdesk.tema') === 'escuro') {
  document.documentElement.dataset.tema = 'escuro'
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
