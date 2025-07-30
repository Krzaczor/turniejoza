import { useEffect, useState } from 'react'
import { useGameConfig } from '@renderer/lib/game-config'

interface UseGameEngineOptions {
  correctAnswerIndex: number
  onRoundEnd?: (is_correct: boolean) => void
}

export const useGameEngine = ({ correctAnswerIndex, onRoundEnd }: UseGameEngineOptions) => {
  const { config } = useGameConfig()

  const [timeLeft, setTimeLeft] = useState(config.timeToAnswer)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [is_correct, setis_correct] = useState<boolean | null>(null)

  // Logika Timera rundy
  useEffect(() => {
    if (!Number.isFinite(config.timeToAnswer)) return

    if (timeLeft <= 0) {
      checkAnswer()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft])

  const selectAnswer = (index: number) => {
    if (isAnswerChecked) {
      return
    }
    setSelectedAnswer(index)
  }

  const checkAnswer = () => {
    if (isAnswerChecked) {
      return
    }

    const is_correctAnswer = selectedAnswer === correctAnswerIndex
    setis_correct(is_correctAnswer)
    setIsAnswerChecked(true)

    if (onRoundEnd) {
      onRoundEnd(is_correctAnswer)
    }
  }

  const resetRound = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setis_correct(null)
    setTimeLeft(config.timeToAnswer)
  }

  return {
    timeLeft,
    selectedAnswer,
    selectAnswer,
    checkAnswer,
    is_correct,
    isAnswerChecked,
    resetRound
  }
}
