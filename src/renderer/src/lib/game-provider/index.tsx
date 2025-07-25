import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

interface GameData {
  players: string[]
  questions: string[]
  currentRound: number
  score: Record<string, number>
}

const defaultGameData: GameData = {
  players: [],
  questions: [],
  currentRound: 0,
  score: {}
}

interface GameContextValue {
  game: GameData
  startNewGame(players: string[], questions: string[]): void
  nextRound(): void
  setScore(player: string, points: number): void
  resetGame(): void
  gameStarted: boolean
}

const GameContext = createContext<GameContextValue | null>(null)

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<GameData>(defaultGameData)
 const [gameStarted, setGameStarted] = useState(false)
  const startNewGame = (players: string[], questions: string[]) => {
    setGame({
      players,
      questions,
      currentRound: 1,
      score: players.reduce((acc, p) => ({ ...acc, [p]: 0 }), {})
    })
       setGameStarted(true)
  }
 
  const nextRound = () => {
    setGame((prev) => ({
      ...prev,
      currentRound: prev.currentRound + 1
    }))
  }

  const setScore = (player: string, points: number) => {
    setGame((prev) => ({
      ...prev,
      score: {
        ...prev.score,
        [player]: (prev.score[player] || 0) + points
      }
    }))
  }

  const resetGame = () => {
    setGame(defaultGameData);
     setGameStarted(false);
  }

  return (
    <GameContext.Provider value={{ game, startNewGame, nextRound, setScore, resetGame,gameStarted, }}>
      {children}
    </GameContext.Provider>
  )
}
