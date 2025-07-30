import { useEffect, useState } from 'react'
import { useGameConfig } from '@renderer/lib/game-config'
import { useGameEngine } from '@renderer/lib/game-engine/useGameEngine'
import { mockData } from '@renderer/constants'
// import { useSceneContext } from '@renderer/lib/react-scene'

interface Round {
  team: Team
  question: Question
}

export const GameScene = () => {
  const { config } = useGameConfig()
  // const { changeScene } = useSceneContext()
  const totalRounds = config.maxRound * config.teams.length

  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoriesToChoose, setCategoriesToChoose] = useState<string[]>([])

  const currentTeam = config.teams[roundIndex % config.teams.length]
  const currentRound = rounds[roundIndex]
  const currentQuestion = currentRound?.question

  const correctAnswerIndex = currentQuestion?.answers.findIndex((a) => a.is_correct) ?? 0

  const { timeLeft, selectedAnswer, selectAnswer, checkAnswer, isAnswerChecked, resetRound } =
    useGameEngine({
      correctAnswerIndex,
      onRoundEnd: () => {
        setTimeout(() => {
          if (roundIndex + 1 >= totalRounds) {
            alert('Gra zakończona! 🎉')
          } else {
            setRoundIndex((i) => i + 1)
            setSelectedCategory(null)
            resetRound()
          }
        }, 2000)
      }
    })

  // --- Krok 1: Inicjalizacja rund ---
  useEffect(() => {
    if (config.chooseCategory) {
      const initialRounds: Round[] = Array.from({ length: totalRounds }, (_, i) => ({
        team: config.teams[i % config.teams.length],
        question: null as unknown as Question
      }))
      setRounds(initialRounds)
    } else {
      const shuffled = [...mockData.questions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, totalRounds)
      const generatedRounds: Round[] = Array.from({ length: totalRounds }, (_, i) => ({
        team: config.teams[i % config.teams.length],
        question: selected[i]
      }))
      setRounds(generatedRounds)
    }
  }, [config])

  // --- Krok 2: Losowanie kategorii dla konfiguracji gry z wyborem kategorii przed każda rundą ---
  useEffect(() => {
    if (!config.chooseCategory || selectedCategory) return

    const allCategories = [...new Set(mockData.questions.map((q) => q.category))]
    const shuffled = allCategories.sort(() => Math.random() - 0.5)
    setCategoriesToChoose(shuffled.slice(0, config.countCategoriesToChoose))
  }, [roundIndex, selectedCategory, config])

  // --- Krok 3: Po wybraniu kategorii losowane jest pytanie z kategorii która została wybrana przez drużynę / gracza
  useEffect(() => {
    if (!selectedCategory || !config.chooseCategory) return

    const questionsInCategory = mockData.questions
      .filter((q) => q.category === selectedCategory)
      .sort(() => Math.random() - 0.5)

    const chosenQuestion = questionsInCategory[0]

    setRounds((prev) => {
      const updated = [...prev]
      updated[roundIndex] = {
        team: currentTeam,
        question: chosenQuestion
      }
      return updated
    })
  }, [selectedCategory, config.chooseCategory, currentTeam, roundIndex])

  // --- Krok 4: Ekran wyboru kategorii (widoczny jest tylko gdy w konfiguratorze gry wybrano opcję losowania kategorii przed każdym pytaniem) ---
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

  //  --- Krok 5: Placeholder ładowania pytań - widoczny tylko jeśli pytanie nie zostało jeszcze wylosowane -----
  if (!currentQuestion)
    return (
      <div className="p-10 gap-2 h-screen flex items-center justify-center">
        <span className="animate-spin">⏳</span>{' '}
        <span className="text-indigo-100 font-medium animate-pulse">Wczytywanie pytania...</span>
      </div>
    )

  return (
    <div className="flex flex-col min-h-screen px-10 py-16 max-w-6xl mx-auto text-[var(--color-text)] bg-[var(--color-background)]">
      {/* --- Informacje o rundzie --- */}
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

      {/* ---- Warianty Odpowiedzi ----*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
        {currentQuestion.answers.map((answer, index) => {
          const letter = String.fromCharCode(65 + index)
          const isSelected = selectedAnswer === index
          const isThis_correct = index === correctAnswerIndex

          const baseStyle =
            'flex items-center gap-5 p-6 rounded-xl border text-xl font-semibold transition-all duration-200 text-left'
          let dynamicStyle = ''

          if (isAnswerChecked) {
            if (isThis_correct) {
              dynamicStyle = 'bg-green-600 text-white border-green-500'
            } else if (isSelected) {
              dynamicStyle = 'bg-red-600 text-white border-red-500'
            } else {
              dynamicStyle = 'bg-[rgba(255,255,255,0.05)] border-gray-700 text-[var(--color-text)]'
            }
          } else {
            dynamicStyle = isSelected
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
              : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-text)] border-gray-600 hover:bg-[rgba(255,255,255,0.08)]'
          }

          const letterStyle =
            isSelected && !isAnswerChecked ? 'bg-white text-blue-700' : 'bg-indigo-500 text-white'

          return (
            <button
              key={answer.id}
              onClick={() => selectAnswer(index)}
              disabled={isAnswerChecked}
              className={`${baseStyle} ${dynamicStyle}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${letterStyle}`}
              >
                {letter}
              </div>
              <span>{answer.content}</span>
            </button>
          )
        })}
      </div>

      {/* --- Panel sterowania --- */}
      <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-700 text-lg">
        <button className="text-base text-[var(--color-text)] hover:text-white font-medium px-5 py-3 rounded transition">
          ⏸️ Pauza
        </button>

        <div className="text-4xl font-semibold">
          ⏱️ {Number.isFinite(timeLeft) ? `${timeLeft}s` : '∞'}
        </div>

        <button
          onClick={checkAnswer}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-lg shadow-md transition disabled:opacity-50 text-lg"
          disabled={selectedAnswer === null || isAnswerChecked}
        >
          ✅ Zatwierdź
        </button>
      </div>
    </div>
  )
}
