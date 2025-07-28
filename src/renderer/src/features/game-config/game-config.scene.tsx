import { useState } from 'react'
import clsx from 'clsx'
import { useGameConfig } from '@renderer/lib/game-config'
import { useSceneContext } from '@renderer/lib/react-scene'

const getNameTeams = (teamCount: number) => {
  return Array.from({ length: teamCount }, (_, i) => `Drużyna ${i + 1}`)
}

export const GameConfigScene = () => {
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(() => getNameTeams(teamCount))
  const [maxRound, setMaxRound] = useState(10)
  const [answerTime, setAnswerTime] = useState(30)
  const [chooseCategory, setChooseCategory] = useState(true)
  const [countCategoriesToChoose, setCountCategoriesToChoose] = useState(3)
  const { changeScene } = useSceneContext()

  const { setConfig } = useGameConfig()

  const changeCountTeamCount = (value: number) => {
    setTeamCount(value)
    setTeamNames(getNameTeams(value))
  }

  const changeChooseCategory = (value: boolean) => {
    setChooseCategory(value)
    setCountCategoriesToChoose((prev) => (value ? prev : 0))
  }

  const changeCountCategoriesToChoose = (value: number) => {
    setCountCategoriesToChoose(Number.isNaN(value) ? 3 : value)
  }

  const changeMaxRound = (value: number) => {
    setMaxRound(Number.isNaN(value) ? 10 : value)
  }

  const startGameHandler = () => {
    setConfig({
      maxRound,
      countCategoriesToChoose,
      timeToAnswer: answerTime,
        chooseCategory, // <== DODAJ TO
      teams: teamNames.map((name) => ({
        name,
        score: 0,
        id: crypto.randomUUID()
      }))
    })

    changeScene('game')
  }

  return (
    <div className="p-6 py-20">
      <div className="w-fit md:w-4xl mx-auto p-10 rounded-xl ring-1 ring-gray-700">
        <h1 className="text-6xl mb-20 tracking-wide text-center uppercase">Konfiguracja gry</h1>

        {/* --- Liczba drużyn --- */}
        <div className="flex content-center mb-6 gap-6">
          <label className="block text-3xl">- Liczba drużyn:</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((number) => (
              <button
                key={number}
                onClick={() => changeCountTeamCount(number)}
                className={clsx('font-bold py-1.5 px-3.5 text-2xl rounded', {
                  'bg-white text-blue-500': teamCount === number,
                  'bg-blue-500 text-white hover:bg-blue-600': teamCount !== number
                })}
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {/* --- Nazwy drużyn --- */}
        <div className="space-y-2 pl-12 mb-12">
          {teamNames.map((name, index) => (
            <div className="flex content-center mb-6 gap-6">
              <label className="block text-xl pt-2">Nazwa drużyny {index + 1}:</label>
           <input
  key={index}
  type="text"
  value={teamNames[index]}
  onChange={(e) => {
    const updated = [...teamNames]
    updated[index] = e.target.value
    setTeamNames(updated)
  }}
  className="border border-gray-500 rounded-lg py-2 px-4 text-xl w-80"
/>
            </div>
          ))}
        </div>

        {/* --- Liczba pytań na drużynę --- */}
        <div className="flex content-center mb-12 gap-6">
          <label className="block text-3xl">- Liczba pytań na drużynę:</label>
          <div className="flex gap-4">
            <input
              type="number"
              className="border border-gray-500 rounded-lg py-2 px-4 text-xl w-22"
              defaultValue={maxRound}
              placeholder={maxRound.toString()}
              onChange={(event) => changeMaxRound(event.target.valueAsNumber)}
            />
          </div>
        </div>

        {/* --- Czas na odpowiedź --- */}
        <div className="flex content-center mb-12 gap-6">
          <label className="block text-3xl">- Czas na odpowiedź:</label>
          <div className="flex gap-4">
            {[30, 60, 120, Infinity].map((number) => (
              <button
                key={number}
                onClick={() => setAnswerTime(number)}
                className={clsx('font-bold py-1.5 px-3.5 text-2xl rounded', {
                  'bg-white text-blue-500': answerTime === number,
                  'bg-blue-500 text-white hover:bg-blue-600': answerTime !== number
                })}
              >
                {!Number.isFinite(number) ? 'Bez limitu' : `${number}s`}
              </button>
            ))}
          </div>
        </div>

        {/* --- Losowanie z lub bez kategorii --- */}
        <div className="flex content-center mb-12 gap-6">
          <label className="block text-3xl">- Czy losować kategorie:</label>
          <div className="flex gap-4">
            {[true, false].map((value, index) => (
              <button
                key={index}
                onClick={() => changeChooseCategory(value)}
                className={clsx('font-bold py-1.5 px-3.5 text-2xl rounded', {
                  'bg-white text-blue-500': chooseCategory === value,
                  'bg-blue-500 text-white hover:bg-blue-600': chooseCategory !== value
                })}
              >
                {value ? 'Tak' : 'Nie'}
              </button>
            ))}
          </div>
        </div>

        {/* --- Ilość kategorii do wybrania --- */}
        {chooseCategory && (
          <div className="flex content-center mb-12 gap-6">
            <label className="block text-3xl">- Liczba kategorii od wybrania:</label>
            <div className="flex gap-4">
              <input
                type="number"
                defaultValue={countCategoriesToChoose}
                onChange={(event) => changeCountCategoriesToChoose(event.target.valueAsNumber)}
                placeholder={countCategoriesToChoose.toString()}
                className="border border-gray-500 rounded-lg py-2 px-4 text-xl w-22"
              />
            </div>
          </div>
        )}

        <button
          className="w-full rounded-lg py-4 text-2xl bg-blue-600 hover:bg-blue-700 font-bold mt-8"
          onClick={startGameHandler}
        >
          Start gry
        </button>
      </div>
    </div>
  )
}
