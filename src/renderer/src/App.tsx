import { GameConfigProvider } from './lib/game-config'
import { Scene, Scenes } from '@renderer/lib/react-scene'
import { MenuScene } from './features/menu/menu.scene'
import { GameConfigScene } from './features/game-config/game-config.scene'
import { GameScene } from './features/game/game.scene'
import { GameEndScene } from './features/game-end/game-end.scene'
import { QuestionsScene } from './features/questions/questions.scene'

function App() {
  return (
    <GameConfigProvider>
      <Scenes main="menu">
        {/* widok główny apki */}
        <Scene name="menu" element={<MenuScene />} />

        {/* widok tworzenia/konfiguracji turnieju / widok turnieju*/}
        <Scene name="game-config" element={<GameConfigScene />} />

        <Scene name="game" element={<GameScene />} />

        {/* widok tabeli końcowej */}
        <Scene name="game-end" element={<GameEndScene />} />

        {/* widok pytań i kategorii, tutaj jest też import i dodawanie pytań */}
        <Scene name="questions" element={<QuestionsScene />} />
      </Scenes>
    </GameConfigProvider>
  )
}

export default App
