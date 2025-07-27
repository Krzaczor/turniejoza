import { useGameConfig } from '@renderer/lib/game-config'

export const GameScene = () => {
  const { config } = useGameConfig()

  return <pre className="m-8 text-xl">{JSON.stringify(config, null, 4)}</pre>
}
