import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect } from 'react'

const getQuestionsByCategory = async (category: string) => {
  return await window.api.questions.findByCategory(category)
}

interface QuestionsListProps {
  activeCategory: string
}

export const QuestionsList = ({ activeCategory }: QuestionsListProps) => {
  const {
    data: questions,
    status: questionsStatus,
    refetch
  } = useQuery<Question[]>({
    queryKey: ['questions', activeCategory],
    queryFn: () => getQuestionsByCategory(activeCategory)
  })

  useEffect(() => {
    window.electron.ipcRenderer.on('insert-success', () => {
      refetch()
    })
  }, [])

  if (questionsStatus === 'pending') {
    return <QuestionsListLoader />
  }

  if (questionsStatus === 'error') {
    return <QuestionsListError />
  }

  if (questions.length === 0) {
    return <QuestionsListEmpty />
  }

  return (
    <ol className="space-y-2 min-w-full list-decimal list-inside text-xl">
      {questions.map(({ id, content, answers }) => (
        <li key={id} className="p-6 rounded-xl odd:bg-[rgb(0,0,60)] hover:bg-gray-800">
          <span className="inline-block content-center mb-2 pl-2">{content}</span>
          <ol className="list-[upper-alpha] list-inside">
            {answers.map((an) => (
              <li
                key={an.id}
                className={clsx('py-2 pl-8 rounded-xl', {
                  'text-green-500': an.is_correct
                  // 'bg-green-900': an.is_correct
                  // 'border-2 border-blue-500': an.is_correct
                })}
              >
                <span className="content-center ml-2">{an.content}</span>
                {an.note && <span className="pl-4">[ {an.note} ]</span>}
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  )
}

const QuestionsListLoader = () => {
  return <h1 className="text-xl p-6">Ładowanie...</h1>
}

const QuestionsListError = () => {
  return (
    <div className="flex text-xl">
      <p>Coś poszło nie tak</p>
      <button onClick={() => location.reload()}>Spróbuj ponownie</button>
    </div>
  )
}

const QuestionsListEmpty = () => {
  const openUploadWindow = () => {
    window.electron.ipcRenderer.send('open-file-dialog')
  }

  return (
    <div className="text-xl space-y-6">
      <div>
        <p>Brak pytań.</p>
        <p>Zaimportuj pytania z pliku.</p>
      </div>
      <button
        className="font-bold py-2 px-4 text-lg rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={openUploadWindow}
      >
        Dodaj pytania
      </button>
    </div>
  )
}
