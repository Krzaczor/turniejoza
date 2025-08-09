import { useGameConfig } from '@renderer/lib/game-config'
import { useEffect, useRef, useState } from 'react'

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

  const roundStartRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const pausedTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      pausedTimeRef.current = timeLeft
      roundStartRef.current = null
      return
    }

    if (!Number.isFinite(config.timeToAnswer)) {
      setTimeLeft(config.timeToAnswer)
      return
    }

    if (isAnswerChecked) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      return
    }

    if (!roundStartRef.current) {
      if (pausedTimeRef.current !== null) {
        roundStartRef.current = Date.now() - (config.timeToAnswer - pausedTimeRef.current) * 1000
      } else {
        roundStartRef.current = Date.now()
      }
    }

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - roundStartRef.current!) / 1000
      const remaining = Math.max(config.timeToAnswer - elapsed, 0)
      const rounded = Math.round(remaining * 10) / 10 // 1 miejsce po przecisku w licznku czasu (np 20.2)
      setTimeLeft(rounded)

      if (remaining <= 0) {
        clearInterval(timerRef.current!)
        timerRef.current = null
        checkAnswer()
      }
    }, 50)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [isActive, isAnswerChecked, config.timeToAnswer])

  const selectAnswer = (index: number) => {
    if (isAnswerChecked) return
    setSelectedAnswer(index)
  }

  const checkAnswer = () => {
    if (isAnswerChecked) return

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
    roundStartRef.current = null
    pausedTimeRef.current = null
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
