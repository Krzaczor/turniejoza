import { useGameConfig } from '@renderer/lib/game-config'
import { ButtonScene } from '@renderer/lib/react-scene'

export const GameEndScene = () => {
  const { config } = useGameConfig()
  const teams = config.teams

  const teamsByScore = teams.sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col gap-14 pt-36 text-center">
      <h1 className="uppercase text-8xl">koniec</h1>
      <div className="bg-gray-900 rounded-lg p-10 w-sm max-w-xl text-white m-auto">
        <h3 className="text-4xl mb-10 text-center">Końcowa tabela</h3>
        <ul className="space-y-6">
          {teamsByScore.map((team) => (
            <li key={team.id} className="flex justify-between text-3xl">
              <span>{team.name}</span>
              <span>{team.score}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-x-8">
        <ButtonScene
          scene="menu"
          className="rounded-xl p-5 px-7 text-white text-3xl border-2 border-gray-600 hover:bg-blue-600 hover:border-blue-600"
        >
          Menu główne
        </ButtonScene>
        <ButtonScene
          scene="game-config"
          className="rounded-xl p-5 px-7 text-white text-3xl border-2 border-gray-600 hover:bg-blue-600 hover:border-blue-600"
        >
          Nastęna gra
        </ButtonScene>
      </div>
    </div>
  )
}
