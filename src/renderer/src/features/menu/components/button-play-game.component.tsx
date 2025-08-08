import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { ButtonScene } from '@renderer/lib/react-scene'

const getCountQuestions = async () => {
  return await window.api.questions.count()
}

interface ButtonPlayGameProps {
  className: string
}

export const ButtonPlayGame = ({ className }: ButtonPlayGameProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['questions.count'],
    queryFn: async () => await getCountQuestions()
  })

  const questionsNotExist = data ? data.count === 0 : false

  return (
    <ButtonScene
      scene="game-config"
      className={clsx(
        className,
        'bg-blue-600 text-white border-transparent hover:bg-blue-700',
        'disabled:text-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
      )}
      disabled={isLoading || questionsNotExist}
    >
      Graj
    </ButtonScene>
  )
}
