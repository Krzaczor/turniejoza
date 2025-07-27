import { createContext, useContext, useState, type PropsWithChildren } from 'react'

interface Team {
  id: string
  name: string
  score: number
}

interface GameConfig {
  teams: Team[]
  maxRound: number
  timeToAnswer: number
  countCategoriesToChoose: number
}

interface GameConfigValue {
  config: GameConfig
  setConfig(state: GameConfig): void
}

const GameConfigContext = createContext<GameConfigValue | null>(null)

export const useGameConfig = () => {
  const context = useContext(GameConfigContext)

  if (!context) {
    throw Error('useGameConfig must be into GameConfigContext')
  }

  return context
}

interface GameConfigProps extends PropsWithChildren {}

export const GameConfigProvider = ({ children }: GameConfigProps) => {
  const [config, setConfig] = useState<GameConfig>({
    countCategoriesToChoose: 0,
    teams: [],
    timeToAnswer: 30,
    maxRound: 0
  })

  return (
    <GameConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </GameConfigContext.Provider>
  )
}
