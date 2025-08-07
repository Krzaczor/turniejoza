import { useEffect, useState } from 'react'
import { mockData } from '@renderer/constants'
import { useGameConfig } from '@renderer/lib/game-config'
import { useGameEngine } from '@renderer/lib/game-engine/useGameEngine'
import { GameControls } from './components/game-controls.component'
import { GameAnswers } from './components/game-answers.component'

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

  // widok wyboru kategorii
  if (config.chooseCategory && !selectedCategory) {
    return (
      <div className="pt-32 space-y-16">
        <h2 className="text-6xl text-white text-center">
          Kategorie dla <span className="text-blue-400">{currentTeam.name}</span>
        </h2>

        <div className="flex flex-col gap-8 w-lg mx-auto">
          {categoriesToChoose.map((category) => (
            <button
              key={category}
              className="rounded-xl p-6 text-white text-3xl border-2 border-gray-600 hover:bg-blue-600 hover:border-blue-600"
              onClick={() => setSelectedCategory(category)}
            >
              <span className="block">{category}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // informacja o wczytywaniu pytania
  if (!currentQuestion) {
    return null
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

  // widok pytań, odpowiedzi, przycisków, tabeli i informacji
  return (
    <div className="flex flex-col h-screen px-10 py-10 w-[1520px] mx-auto">
      {/* Tabela wyników drużyn w lewym górnym rogu */}
      <div className="fixed top-6 left-6 bg-gray-900 rounded-lg p-4 w-50 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">Wyniki drużyn</h3>
        <ul className="space-y-2">
          {config.teams.map((team) => (
            <li key={team.id} className="flex justify-between text-lg">
              <span>{team.name}</span>
              <span>{team.score}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Informacje o turze */}
      <div className="mb-14 text-center">
        <h2 className="text-2xl">Tura: {currentTeam.name}</h2>
        {/* Informacja o rundzie w prawym górnym rogu */}
        <div className="fixed top-6 right-6 bg-gray-900 text-white p-4 rounded-lg text-lg space-x-2">
          <span className="font-semibold">Runda:</span>
          <span>
            {Math.floor(roundIndex / config.teams.length) + 1} / {config.maxRound}
          </span>
        </div>
      </div>

      {/* Pytanie */}
      <div className="text-4xl space-y-6 mb-14">
        <p className="text-2xl">Kategoria: {selectedCategory}</p>
        <p>{currentQuestion.content}</p>
      </div>

      {/* Odpowiedzi */}
      <GameAnswers
        isAnswerChecked={isAnswerChecked}
        correctAnswerIndex={correctAnswerIndex}
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        selectAnswer={selectAnswer}
      />

      {/* Kontrolki */}
      <GameControls
        timeLeft={timeLeft}
        isAnswerChecked={isAnswerChecked}
        isGamePaused={isGamePaused}
        selectedAnswer={selectedAnswer}
        goToNextRound={goToNextRound}
        checkAnswer={checkAnswer}
        setIsGamePaused={setIsGamePaused}
      />
    </div>
  )
}
