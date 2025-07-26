import { ButtonScene } from '@renderer/lib/react-scene'
import { useState } from 'react'

interface Props {
  onStartGame: (players: string[], questionCount: number, answerTime: number) => void
}

export const GameConfigScene = ({ onStartGame }: Props) => {
  const [teamCount, setTeamCount] = useState(2)
  const [teamNames, setTeamNames] = useState(['', ''])
  const [questionCount, setQuestionCount] = useState(10)
  const [customQuestionCount, setCustomQuestionCount] = useState<number | ''>('')
  const [answerTime, setAnswerTime] = useState(30)

  const handleTeamCountChange = (count: number) => {
    setTeamCount(count)
    setTeamNames((prev) => {
      const newNames = [...prev]
      while (newNames.length < count) newNames.push('')
      return newNames.slice(0, count)
    })
  }

  const handleTeamNameChange = (index: number, value: string) => {
    setTeamNames((prev) => {
      const newNames = [...prev]
      newNames[index] = value
      return newNames
    })
  }

  const handleQuestionCountChange = (value: number | '') => {
    if (typeof value === 'number') {
      setQuestionCount(value)
      setCustomQuestionCount('')
    } else {
      setCustomQuestionCount('')
    }
  }

  const handleCustomQuestionCountChange = (value: string) => {
    const num = Number(value)
    if (!value) {
      setCustomQuestionCount('')
      return
    }
    if (!isNaN(num) && num > 0) {
      setCustomQuestionCount(num)
      setQuestionCount(num)
    }
  }

  const handleStart = () => {
    if (teamNames.some((name) => name.trim() === '')) {
      alert('Wprowadź nazwy wszystkich drużyn')
      return
    }
    onStartGame(teamNames, questionCount, answerTime)
  }

  return (
    <div className='relative min-h-screen p-2 md:p-6'>
    <div
      className="
        max-w-3xl mx-auto p-8 rounded-xl shadow-lg ring-1 ring-gray-700
        bg-[var(--color-background)] text-[var(--color-text)]
      "
    >
      <h2 className="text-3xl font-semibold mb-10 tracking-wide">
        Konfiguracja gry
      </h2>

      {/* ---- Liczba drużyn ---- */}
      <div className="mb-8">
        <label className="block mb-3 text-lg font-medium tracking-wide">
          Liczba drużyn
        </label>
        <select
          className="
            w-full rounded-md border border-gray-600 bg-[var(--color-background)] px-5 py-3
            text-[var(--color-text)] text-lg transition
            focus:outline-none focus:ring-4 focus:ring-indigo-500
          "
          value={teamCount}
          onChange={(e) => handleTeamCountChange(Number(e.target.value))}
        >
          {[2, 3, 4, 5].map((num) => (
            <option key={num} value={num} className="bg-[var(--color-background)] text-[var(--color-text)]">
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* ---- Nazwy drużyn ---- */}
      <div className="mb-10 space-y-6">
        {teamNames.slice(0, teamCount).map((name, i) => (
          <div key={i}>
            <label className="block mb-2 text-lg font-medium tracking-wide">
              Nazwa drużyny {i + 1}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleTeamNameChange(i, e.target.value)}
              placeholder={`Drużyna ${i + 1}`}
              className="
                w-full rounded-md border border-gray-600 bg-[var(--color-background)]
                px-4 py-3 text-[var(--color-text)] text-lg placeholder:text-gray-500
                transition focus:outline-none focus:ring-4 focus:ring-indigo-500
              "
            />
          </div>
        ))}
      </div>

      {/* ---- Liczba pytań ---- */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className="block mb-3 text-lg font-medium tracking-wide">
            Liczba pytań
          </label>
          <select
            className="
              w-full rounded-md border border-gray-600 bg-[var(--color-background)] px-5 py-3
              text-[var(--color-text)] text-lg transition
              focus:outline-none focus:ring-4 focus:ring-indigo-500 disabled:opacity-60
            "
            value={customQuestionCount === '' ? questionCount : ''}
            onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
            disabled={customQuestionCount !== ''}
          >
            {[10, 15, 20].map((num) => (
              <option key={num} value={num} className="bg-[var(--color-background)] text-[var(--color-text)]">
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-3 text-lg font-medium tracking-wide">
            Lub wpisz własną
          </label>
          <input
            type="number"
            min={1}
            value={customQuestionCount}
            onChange={(e) => handleCustomQuestionCountChange(e.target.value)}
            placeholder="Własna liczba pytań"
            className="
              w-full rounded-md border border-gray-600 bg-[var(--color-background)]
              px-4 py-3 text-[var(--color-text)] text-lg placeholder:text-gray-500
              transition focus:outline-none focus:ring-4 focus:ring-indigo-500
            "
          />
        </div>
      </div>

      {/* ---- Czas na odpowiedź ----*/}
      <div className="mb-12">
        <label className="block mb-3 text-lg font-medium tracking-wide">
          Czas na odpowiedź (sekundy)
        </label>
        <select
          className="
            w-full rounded-md border border-gray-600 bg-[var(--color-background)] px-5 py-3
            text-[var(--color-text)] text-lg transition
            focus:outline-none focus:ring-4 focus:ring-indigo-500
          "
          value={answerTime}
          onChange={(e) => setAnswerTime(Number(e.target.value))}
        >
          {[30, 45, 60].map((sec) => (
            <option key={sec} value={sec} className="bg-[var(--color-background)] text-[var(--color-text)]">
              {sec} sekund
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleStart}
        className="
          w-full rounded-lg bg-indigo-600 py-4 text-lg font-semibold text-white shadow-md
          transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400
        "
      >
        Start gry
      </button>
        <div className="absolute bottom-4 left-4">
              <ButtonScene scene="menu" className="text-lg flex items-center gap-1 hover:text-indigo-100">
                ↩ <span className="hidden sm:inline">Wróć</span>
              </ButtonScene>
            </div>
    </div>
    </div>
  )
}
