import clsx from 'clsx'

interface GameControlsProps {
  timeLeft: number
  isGamePaused: boolean
  isAnswerChecked: boolean
  selectedAnswer: number | null
  setIsGamePaused: {
    (s: boolean): void
    (fn: (s: boolean) => boolean): void
  }
  checkAnswer(): void
  goToNextRound(): void
}

export const GameControls = ({
  timeLeft,
  isGamePaused,
  isAnswerChecked,
  selectedAnswer,
  setIsGamePaused,
  checkAnswer,
  goToNextRound
}: GameControlsProps) => {
  return (
    <div className="mt-auto pb-8 grid grid-cols-3 w-[1000px] mx-auto space-x-20">
      <button
        onClick={() => setIsGamePaused((prev) => !prev)}
        className={clsx(
          'px-6 py-4 rounded-lg text-white text-xl border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-blue-600 border-transparent hover:bg-blue-700': isGamePaused
          }
        )}
        disabled={isAnswerChecked || !Number.isFinite(timeLeft)}
      >
        {isGamePaused ? 'Wznów odliczanie' : ' Zatrzymaj czas'}
      </button>
      <div
        className={clsx('text-4xl text-center pt-2.5', {
          'scale-125': Number.isFinite(timeLeft),
          'opacity-50': !Number.isFinite(timeLeft),
          'text-yellow-600': timeLeft <= 10 && timeLeft > 5,
          'text-red-600': timeLeft <= 5 && timeLeft > 0
        })}
      >
        <span>{Number.isFinite(timeLeft) ? `${timeLeft}s` : '--:--'}</span>
      </div>
      {!isAnswerChecked ? (
        <button
          onClick={checkAnswer}
          className="px-6 py-4 rounded-lg text-xl border border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedAnswer === null}
        >
          Sprawdź odpowiedź
        </button>
      ) : (
        <button
          onClick={goToNextRound}
          className="px-6 py-4 rounded-lg text-white text-xl border border-transparent bg-blue-600 hover:bg-blue-700"
        >
          Następna runda
        </button>
      )}
    </div>
  )
}
