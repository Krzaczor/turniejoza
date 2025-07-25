import { useEffect } from "react"
import { useGame } from "@renderer/lib/game-provider"
import { useSceneContext } from "@renderer/lib/react-scene" // <-- dodaj to!

export const GameScene = () => {
  const { game } = useGame()
  const { changeScene } = useSceneContext() 

 console.log(game)


  useEffect(() => {
    const noPlayers = game.players.length === 0
    const noQuestions = game.questions.length === 0

    if (noPlayers || noQuestions) {
      changeScene('game-config') 
    }
  }, [game, changeScene])

  return <h1>GameScene</h1>
}