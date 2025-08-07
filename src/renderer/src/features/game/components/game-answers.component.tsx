import clsx from 'clsx'

interface GameAnswersProps {
  currentQuestion: Question
  selectedAnswer: number | null
  correctAnswerIndex: number
  isAnswerChecked: boolean
  selectAnswer(index: number): void
}

export const GameAnswers = ({
  currentQuestion,
  selectedAnswer,
  correctAnswerIndex,
  isAnswerChecked,
  selectAnswer
}: GameAnswersProps) => {
  return (
    <div className="flex flex-col space-y-6 mb-14">
      {currentQuestion.answers.map((answer, idx) => {
        const letter = String.fromCharCode(65 + idx)
        const isSelected = selectedAnswer === idx
        const isCorrect = idx === correctAnswerIndex

        return (
          <button
            key={answer.id}
            onClick={() => selectAnswer(idx)}
            disabled={isAnswerChecked}
            className={clsx('relative p-6 rounded-lg border text-2xl text-white text-left', {
              'bg-green-950 border-green-950': isAnswerChecked && isCorrect,
              'bg-red-950 border-red-950': isAnswerChecked && isSelected && !isCorrect,
              'bg-blue-800 border-gray-400': isSelected,
              'border-gray-600': !isSelected
            })}
          >
            <div className="absolute text-2xl">{letter}</div>
            <div className="pl-10 space-y-2">
              <p>{answer.content}</p>
              {answer.note && isAnswerChecked && (
                <p className="text-lg text-yellow-300">{answer.note}</p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
