import { type FunctionComponent, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import z from 'zod'
// import { mockData } from '@renderer/constants'
import { useGameConfig } from '@renderer/lib/game-config'
import { useGameEngine } from '@renderer/lib/game-engine/useGameEngine'
import { GameControls } from './components/game-controls.component'
import { GameAnswers } from './components/game-answers.component'
import { toShuffled } from './utils/shuffle'
import { ButtonScene, useSceneContext } from '@renderer/lib/react-scene'

interface Round {
  team: Team
  question: Question
}

export const GameScene = withDatabse(({ data }) => {
  const { changeScene } = useSceneContext()
  const { config, setConfig } = useGameConfig()
  const totalRounds = config.maxRound * config.teams.length

  const [isGamePaused, setIsGamePaused] = useState(true)
  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoriesToChoose, setCategoriesToChoose] = useState<Category[]>([])

  const prevCategory = useRef<string | null>(null)

  const currentTeam = config.teams[roundIndex % config.teams.length]
  const currentRound = rounds[roundIndex]
  const currentQuestion = currentRound?.question
  const correctAnswerIndex = currentQuestion?.answers.findIndex((a) => a.is_correct) ?? 0

  const game = useGameEngine({
    correctAnswerIndex,
    isActive: !isGamePaused && !!currentQuestion,

    // Aktualizacja punktów w onRoundEnd
    onRoundEnd: (isCorrect: boolean) => {
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
  })

  /**
   * useEffect if ustawia drużyny i pytanie (?)
   * else miesza pytania i ustawia je dla drużyn (?)
   */
  useEffect(() => {
    if (config.chooseCategory) {
      // robi się jeśli ustawiono w konfigu wybór kategorii
      const initial = Array.from({ length: totalRounds }, (_, i) => ({
        team: config.teams[i % config.teams.length],
        question: null as unknown as Question
      }))
      setRounds(initial)
    } else {
      // robi się jeśli nie było do wyboru kategorii
      const shuffled = toShuffled(data.questions)
      const selected = shuffled.slice(0, totalRounds)
      const gens = selected.map((q, i) => ({
        team: config.teams[i % config.teams.length],
        question: {
          ...q,
          answers: toShuffled(q.answers)
        }
      }))
      setRounds(gens)
    }
  }, [data])

  /**
   * useEffect losujący kategorie do wyboru. Tyle ile podano w konfiguracji
   */
  useEffect(() => {
    if (!config.chooseCategory || selectedCategory) {
      return
    }

    const categories = data.categories.filter((c) => c.id !== prevCategory.current)
    const categoriesShuffle = toShuffled(categories)
    setCategoriesToChoose(categoriesShuffle.slice(0, config.countCategoriesToChoose))
  }, [roundIndex, selectedCategory, data])

  /**
   * useEffect losujący pytanie i ustawiający jaka drużyna odpowiada
   */
  useEffect(() => {
    if (!selectedCategory || !config.chooseCategory) {
      return
    }

    const categories = data.questions.filter((q) => q.category === selectedCategory)
    const shuffledQuestions = toShuffled(categories)
    const question = {
      ...shuffledQuestions[0],
      answers: toShuffled(shuffledQuestions[0].answers)
    }

    setRounds((prev) => {
      const upd = [...prev]
      upd[roundIndex] = { team: currentTeam, question }
      return upd
    })
  }, [selectedCategory, currentTeam.id, roundIndex, data])

  const { timeLeft, selectedAnswer, selectAnswer, checkAnswer, isAnswerChecked, resetRound } = game

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
              key={category.id}
              className="rounded-xl p-6 text-white text-3xl border-2 border-gray-600 hover:bg-blue-600 hover:border-blue-600"
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="block">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="fixed bottom-14 left-14 w-48">
          <ButtonScene
            scene="menu"
            className="px-6 py-4 rounded-lg text-white w-full text-xl border border-gray-500 hover:bg-blue-950"
          >
            Wróć do menu
          </ButtonScene>
        </div>
      </div>
    )
  }

  // informacja o wczytywaniu pytania
  if (!currentQuestion) {
    return null
  }

  const goToNextRound = () => {
    setIsGamePaused(true)

    if (roundIndex + 1 >= totalRounds) {
      changeScene('game-end')
    } else {
      setRoundIndex((i) => i + 1)
      setSelectedCategory(null)
      resetRound()
    }
  }

  const checkAnswerAndSaveCurrentQuestion = (): void => {
    prevCategory.current = currentQuestion.category

    data.questions = data.questions.filter((q) => q.id !== currentQuestion.id)
    data.categories = data.categories.filter(
      (c) => data.questions.some((q) => q.category === c.id) || c.id !== currentQuestion.category
    )

    checkAnswer()
  }

  // widok pytań, odpowiedzi, przycisków, tabeli i informacji
  return (
    <div className="flex flex-col h-screen px-10 py-10">
      {/* Tabela wyników drużyn w lewym górnym rogu */}
      <div className="fixed top-10 left-10 bg-gray-900 rounded-lg p-4 w-50 text-white scale-120">
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
        <div className="fixed top-10 right-10 bg-gray-900 text-white p-4 rounded-lg text-lg space-x-2 scale-120">
          <span className="font-semibold">Runda:</span>
          <span>
            {Math.floor(roundIndex / config.teams.length) + 1} / {config.maxRound}
          </span>
        </div>
      </div>

      {/* Pytanie */}
      <div className="text-4xl space-y-6 mb-14 ml-72">
        <p className="text-2xl">
          Kategoria: {data.categories.find((c) => c.id === currentQuestion.category)?.name}
        </p>
        <p className="leading-12">{currentQuestion.content}</p>
      </div>

      {/* Odpowiedzi */}
      <GameAnswers
        answers={currentQuestion.answers}
        selectedAnswer={selectedAnswer}
        isAnswerChecked={isAnswerChecked}
        correctAnswerIndex={correctAnswerIndex}
        selectAnswer={selectAnswer}
      />

      {/* Kontrolki */}
      <GameControls
        timeLeft={timeLeft}
        isAnswerChecked={isAnswerChecked}
        isGamePaused={isGamePaused}
        selectedAnswer={selectedAnswer}
        goToNextRound={goToNextRound}
        checkAnswer={checkAnswerAndSaveCurrentQuestion}
        setIsGamePaused={setIsGamePaused}
      />
    </div>
  )
})

// hoc do pobrania całej bazy

const answer = z.object({
  id: z.string(),
  content: z.string(),
  is_correct: z.boolean(),
  note: z.union([z.string(), z.null()])
})

const category = z.object({
  id: z.string(),
  name: z.string()
})

const question = z.object({
  id: z.string(),
  content: z.string(),
  category: z.string(),
  answers: z.array(answer)
})

const database = z.object({
  categories: z.array(category),
  questions: z.array(question)
})

type Database = z.infer<typeof database>

const getDatabaseAll = async () => {
  // const result = await new Promise((resolve) => resolve(mockData))
  const result = await window.api.database.all()
  const { categories, questions } = database.parse(result)

  const data: Database = {
    questions,
    categories: categories.filter((c) => questions.some((q) => q.category === c.id))
  }

  return data
}

interface GameSceneProps {
  data: Database
}

function withDatabse(Component: FunctionComponent<GameSceneProps>) {
  return () => {
    const { data, status } = useQuery({
      queryKey: ['database.all'],
      queryFn: () => getDatabaseAll(),
      staleTime: 0,
      gcTime: 1
    })

    if (status === 'error') {
      return <h1 className="p-8 text-2xl">Coś poszło nie tak przy pobieraniu danych</h1>
    }

    if (status !== 'success' || !data) {
      return null
    }

    return <Component data={data} />
  }
}
