import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ViagemProvider } from '@/context/ViagemProvider'

import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import './styles/layout.css'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('Elemento #root não encontrado no index.html.')

createRoot(raiz).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ViagemProvider>
          <App />
        </ViagemProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
