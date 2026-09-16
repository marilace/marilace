import { Rotas } from './routes/Rotas'
import { AutenticacaoProvider } from './contexts/AutenticacaoContexto'
import { AcessibilidadeProvider } from './contexts/AcessibilidadeContexto'

function App() {
  return (
    <AcessibilidadeProvider>
      <AutenticacaoProvider>
        <Rotas />
      </AutenticacaoProvider>
    </AcessibilidadeProvider>
  )
}

export default App
