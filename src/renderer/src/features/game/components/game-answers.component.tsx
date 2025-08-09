import clsx from 'clsx'

interface GameAnswersProps {
  answers: Answer[]
  selectedAnswer: number | null
  correctAnswerIndex: number
  isAnswerChecked: boolean
  selectAnswer(index: number): void
}

export const GameAnswers = ({
  answers,
  selectedAnswer,
  correctAnswerIndex,
  isAnswerChecked,
  selectAnswer
}: GameAnswersProps) => {
  // const data = shuffle(answers)
  // const data = toShuffled(answers)
  const data = answers

  return (
    <div className="flex flex-col space-y-6 mb-14 ml-72">
      {data.map((answer, index) => {
        const letter = String.fromCharCode(65 + index)
        const isSelected = selectedAnswer === index
        const isCorrect = index === correctAnswerIndex

        return (
          <button
            key={answer.id}
            onClick={() => selectAnswer(index)}
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
