import { useEffect, useState } from 'react'
import { useGameConfig } from '@renderer/lib/game-config'
import { useGameEngine } from '@renderer/lib/game-engine/useGameEngine'
import { mockData } from '@renderer/constants'

interface Round {
  team: Team
  question: Question
}

export const GameScene = () => {
  const { config, setConfig } = useGameConfig()
  const totalRounds = config.maxRound * config.teams.length

  const [isGamePaused, setIsGamePaused] = useState(false)
  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoriesToChoose, setCategoriesToChoose] = useState<string[]>([])

  const currentTeam = config.teams[roundIndex % config.teams.length]
  const currentRound = rounds[roundIndex]
  const currentQuestion = currentRound?.question
  const correctAnswerIndex = currentQuestion?.answers.findIndex((a) => a.is_correct) ?? 0

  // Aktualizacja punktów w onRoundEnd
  const onRoundEnd = (isCorrect: boolean) => {
    if (isCorrect) {
      const updatedTeams = config.teams.map((team) => {
        if (team.id === currentTeam.id) {
          return { ...team, score: (team.score ?? 0) + 1 }
        }
        return team
      })
      setConfig({ ...config, teams: updatedTeams })
    }
  }

  const { timeLeft, selectedAnswer, selectAnswer, checkAnswer, isAnswerChecked, resetRound } =
    useGameEngine({
      correctAnswerIndex,
      isActive: !isGamePaused && !!currentQuestion,
      onRoundEnd
    })

  useEffect(() => {
    if (config.chooseCategory) {
      const initial = Array.from({ length: totalRounds }, (_, i) => ({
        team: config.teams[i % config.teams.length],
        question: null as unknown as Question
      }))
      setRounds(initial)
    } else {
      const shuffled = [...mockData.questions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, totalRounds)
      const gens = selected.map((q, i) => ({
        team: config.teams[i % config.teams.length],
        question: q
      }))
      setRounds(gens)
    }
  }, [])

  useEffect(() => {
    if (!config.chooseCategory || selectedCategory) return
    const cats = Array.from(new Set(mockData.questions.map((q) => q.category)))
    setCategoriesToChoose(
      cats.sort(() => Math.random() - 0.5).slice(0, config.countCategoriesToChoose)
    )
  }, [roundIndex, selectedCategory, config])

  useEffect(() => {
    if (!selectedCategory || !config.chooseCategory) return
    const byCat = mockData.questions.filter((q) => q.category === selectedCategory)
    const chosen = byCat.sort(() => Math.random() - 0.5)[0]
    setRounds((prev) => {
      const upd = [...prev]
      upd[roundIndex] = { team: currentTeam, question: chosen }
      return upd
    })
  }, [selectedCategory, config.chooseCategory, currentTeam, roundIndex])

  if (config.chooseCategory && !selectedCategory) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl mb-4">🎯 Tura: {currentTeam.name}</h2>
        <p className="mb-6 text-xl">Wybierz kategorię:</p>
        <div className="flex gap-6 justify-center flex-wrap">
          {categoriesToChoose.map((category) => (
            <button
              key={category}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="p-10 gap-2 h-screen flex items-center justify-center">
        <span className="animate-spin">⏳</span>
        <span className="text-indigo-100 font-medium animate-pulse">Wczytywanie pytania...</span>
      </div>
    )
  }

  const goToNextRound = () => {
    if (roundIndex + 1 >= totalRounds) {
      alert('Gra zakończona! 🎉')
    } else {
      setRoundIndex((i) => i + 1)
      setSelectedCategory(null)
      resetRound()
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen px-10 py-16 max-w-6xl mx-auto">
      {/* Tabela wyników drużyn - fixed w lewym górnym rogu */}
      <div className="fixed top-4 left-4 bg-gray-900 bg-opacity-80 rounded-lg p-4 w-48 text-white shadow-lg z-50">
        <h3 className="text-xl font-bold mb-2 text-center">Wyniki drużyn</h3>
        <ul className="space-y-1">
          {config.teams.map((team) => (
            <li key={team.id} className="flex justify-between text-lg font-semibold">
              <span>{team.name}</span>
              <span>{team.score ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Informacje o turze */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">Tura : {currentTeam.name}</h2>
        <p>
          Runda {Math.floor(roundIndex / config.teams.length) + 1} z {config.maxRound}
        </p>
        {selectedCategory && (
          <p className="text-lg mt-2 text-gray-400">Kategoria: {selectedCategory}</p>
        )}
      </div>

      {/* Pytanie */}
      <div className="text-4xl font-bold mb-24 leading-snug tracking-tight text-center">
        {currentQuestion.content}
      </div>

      {/* Odpowiedzi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
        {currentQuestion.answers.map((answer, idx) => {
          const letter = String.fromCharCode(65 + idx)
          const isSel = selectedAnswer === idx
          const isCorr = idx === correctAnswerIndex
          const base = 'flex items-center gap-5 p-6 rounded-xl border text-xl font-semibold'
          let dyn = ''
          if (isAnswerChecked) {
            dyn = isCorr
              ? 'bg-green-600 text-white border-green-500'
              : isSel
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-[rgba(255,255,255,0.05)] border-gray-700 text-[var(--color-text)]'
          } else {
            dyn = isSel
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
              : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text)] border-gray-600 hover:bg-[rgba(255,255,255,0.08)]'
          }
          const litSty =
            isSel && !isAnswerChecked ? 'bg-white text-blue-700' : 'bg-indigo-500 text-white'
          return (
            <button
              key={answer.id}
              onClick={() => selectAnswer(idx)}
              disabled={isAnswerChecked}
              className={`${base} ${dyn} transition-all duration-200`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${litSty}`}
              >
                {letter}
              </div>
              <span>{answer.content}</span>
            </button>
          )
        })}
      </div>

      {/* Kontrolki */}
      <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-700 text-lg">
        <button
          onClick={() => setIsGamePaused((prev) => !prev)}
          className="hover:text-white font-medium px-5 py-3 rounded max-w-[160px] min-w-[160px] text-lg"
        >
          {isGamePaused ? '▶️ Wznów' : '⏸️ Pauza'}
        </button>
        <div className="text-4xl font-semibold">
          ⏱️ {Number.isFinite(timeLeft) ? `${timeLeft}s` : '∞'}
        </div>
        {!isAnswerChecked ? (
          <button
            onClick={checkAnswer}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-lg shadow-md transition disabled:opacity-50"
            disabled={selectedAnswer === null}
          >
            ✅ Zatwierdź odpowiedź
          </button>
        ) : (
          <button
            onClick={goToNextRound}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg shadow-md transition"
          >
            ▶️ Następna runda
          </button>
        )}
      </div>
    </div>
  )
}
