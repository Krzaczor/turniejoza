import { GameProvider } from './lib/game-provider'
import AppContent from './features/app-content/AppContent'

function App() {

  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
