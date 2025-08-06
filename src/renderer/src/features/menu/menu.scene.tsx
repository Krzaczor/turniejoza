import { clsx } from 'clsx'
import { ButtonScene } from '@renderer/lib/react-scene'
import { useQuery } from '@tanstack/react-query'

export const MenuScene = () => {
  const exitGamehandler = () => {
    window.electron.ipcRenderer.send('close-app')
  }

  const className = 'inline-block text-4xl p-3 m-3 w-96 uppercase border rounded-xl'

  return (
    <div className="pt-48 h-s">
      <h1 className="text-7xl md:text-8xl mb-16 uppercase text-center text-indigo-100">
        Teleturniej
      </h1>
      <div className="flex flex-col content-center w-fit text-center m-auto">
        <ButtonPlayGame className={className} />
        <ButtonScene scene="questions" className={className}>
          Pytania
        </ButtonScene>
        <button className={className} onClick={exitGamehandler}>
          Zamknij
        </button>
      </div>
    </div>
  )
}

const getCountQuestions = async () => {
  return await window.api.questions.count()
}

interface ButtonPlayGameProps {
  className: string
}

const ButtonPlayGame = ({ className }: ButtonPlayGameProps) => {
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
        'bg-blue-600 text-white border-transparent hover:bg-blue-600/85',
        'disabled:text-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
      )}
      disabled={isLoading || questionsNotExist}
    >
      Graj
    </ButtonScene>
  )
}
