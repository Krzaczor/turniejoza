import { useEffect, useRef, useState } from 'react'
import { useGameConfig } from '@renderer/lib/game-config'

interface UseGameEngineOptions {
  correctAnswerIndex: number
  onRoundEnd?: (is_correct: boolean) => void
  isActive?: boolean
}

export const useGameEngine = ({
  correctAnswerIndex,
  onRoundEnd,
  isActive
}: UseGameEngineOptions) => {
  const { config } = useGameConfig()

  const [timeLeft, setTimeLeft] = useState(config.timeToAnswer)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)

  // Lgoika timera rudyny
  useEffect(() => {
    // zatrzymaj timer gdy nie wylosowano jeszcze pytania bądź zatrzymano czas
    if (!isActive) return
    // zatrzymaj timer gdy w konfiguratorze gry wybrano opcje rudn nie limitowanych czasem
    if (!Number.isFinite(config.timeToAnswer)) return
    // zatrzymaj timer gdy udzielono odpowiedzi i została ona zatwierdzona
    if (isAnswerChecked) return
    // zatrzymaj timer gdy licznik czasu osiągnie wartość 0
    if (timeLeft <= 0) {
      checkAnswer()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, isAnswerChecked, isActive])

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
    setIsAnswerChecked(true)

    if (onRoundEnd) {
      onRoundEnd(is_correctAnswer)
    }
  }

  const resetRound = () => {
    setSelectedAnswer(null)
    setIsAnswerChecked(false)
    setTimeLeft(config.timeToAnswer)
  }

  return {
    timeLeft,
    selectedAnswer,
    selectAnswer,
    checkAnswer,
    isAnswerChecked,
    resetRound
  }
}
