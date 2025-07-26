import { useGame } from '@renderer/lib/game-provider'
import { ButtonScene, Scene, Scenes } from '@renderer/lib/react-scene'
import { MenuScene } from '../menu/menu.scene'
import { GameConfigScene } from '../game-config/game-config.scene'
import { GameScene } from '../game/game.scene'
import { GameEndScene } from '../game-end/game-end.scene'
import { QuestionsScene } from '../questions/questions.scene'
import { QuestionsImportScene } from '../questions-import/questions-import.scene'
import { QuestionsAddScene } from '../questions-add/questions-add.scene'
import { QuestionsAddSelfScene } from '../questions-add-self/questions-add-self.scene'

function AppContent() {
  const { startNewGame,gameStarted } = useGame()  

const handleStartGame = (players: string[], questionCount: number, answerTime: number) => {
    const questions = Array(questionCount).fill('Pytanie')
    startNewGame(players, questions)
  }

  return (
    <Scenes main="menu">      
 {/* tymczasowy przycisk na czas tworzenia (ukryć albo usunąć) */}
      <ButtonScene scene="menu" className="absolute bottom-5 left-5">
        powrót do menu <p className="text-sm">(usunąć na koniec)</p>
      </ButtonScene>

 {/* widok główny apki */}
      <Scene name="menu" element={<MenuScene />} />
         {/* widok tworzenia/konfiguracji turnieju / widok turnieju*/}
      <Scene name="game-config" element={ gameStarted ? <GameScene/> : <GameConfigScene onStartGame={handleStartGame} />} />

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
  )
}


export default AppContent
