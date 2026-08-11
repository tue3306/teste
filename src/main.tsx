import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { AuthProvider } from '@/context/AuthProvider'
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
        {/* A autenticação envolve a viagem: o cabeçalho da plataforma precisa
            do usuário, e a rota protegida decide antes de qualquer tela de
            viagem montar. */}
        <AuthProvider>
          <ViagemProvider>
            <App />
          </ViagemProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
