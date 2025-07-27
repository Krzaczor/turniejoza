import { GameConfigProvider } from './lib/game-config'
import { ButtonScene, Scene, Scenes } from '@renderer/lib/react-scene'
import { MenuScene } from './features/menu/menu.scene'
import { GameConfigScene } from './features/game-config/game-config.scene'
import { GameScene } from './features/game/game.scene'
import { GameEndScene } from './features/game-end/game-end.scene'
import { QuestionsScene } from './features/questions/questions.scene'
import { QuestionsImportScene } from './features/questions-import/questions-import.scene'
import { QuestionsAddScene } from './features/questions-add/questions-add.scene'
import { QuestionsAddSelfScene } from './features/questions-add-self/questions-add-self.scene'

function App() {
  return (
    <GameConfigProvider>
      <Scenes main="menu">
        {/* tymczasowy przycisk na czas tworzenia (ukryć albo usunąć) */}
        <ButtonScene scene="menu" className="fixed bottom-5 left-5 z-[999]">
          powrót do menu <p className="text-sm">(usunąć na koniec)</p>
        </ButtonScene>

        {/* widok główny apki */}
        <Scene name="menu" element={<MenuScene />} />

        {/* widok tworzenia/konfiguracji turnieju / widok turnieju*/}
        <Scene name="game-config" element={<GameConfigScene />} />

        <Scene name="game" element={<GameScene />} />

        {/* widok tabeli końcowej */}
        <Scene name="game-end" element={<GameEndScene />} />

        {/* widok pytań i kategorii, tutaj jest też import i dodawanie pytań */}
        <Scene name="questions" element={<QuestionsScene />} />

        {/* widok importu pytań (może być ich podgląd i zatwierdzenie) */}
        <Scene name="questions-import" element={<QuestionsImportScene />} />

        {/* widok formularza dodającego pytanie ręcznie */}
        <Scene name="questions-add" element={<QuestionsAddScene />} />

        {/* widok pola do dodawania pytań jakby to był plik */}
        <Scene name="questions-add-self" element={<QuestionsAddSelfScene />} />
      </Scenes>
    </GameConfigProvider>
  )
}

export default App
