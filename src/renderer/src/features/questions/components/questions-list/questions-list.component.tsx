import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

const getCategory = async (id: string) => {
  return await window.api.categories.findOne(id)
}

const getQuestionsByCategory = async (category_id: string) => {
  return await window.api.questions.findByCategory(category_id)
}

interface QuestionsListProps {
  activeCategory: string
}

export const QuestionsList = ({ activeCategory }: QuestionsListProps) => {
  const { data: questions, status: questionsStatus } = useQuery<Question[]>({
    queryKey: ['categories', activeCategory],
    queryFn: () => getQuestionsByCategory(activeCategory)
  })

  const { data: category, status: categoryStatus } = useQuery<Category | null>({
    queryKey: ['category', activeCategory],
    queryFn: () => getCategory(activeCategory)
  })

  if (questionsStatus === 'pending' || categoryStatus === 'pending') {
    return <h1 className="text-4xl p-6">Ładowanie...</h1>
  }

  if (questionsStatus === 'error' || categoryStatus === 'error') {
    return (
      <div className="flex max-h-[100vh]">
        <p>Coś poszło nie tak</p>
        <button onClick={() => location.reload()}>Spróbuj ponownie</button>
      </div>
    )
  }

  if (questions.length === 0 || !category) {
    return (
      <div className="flex max-h-[100vh]">
        <p>Pusto, więc nic nie ma. Możesz zaimportować dane</p>
        <input type="file" />
      </div>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Pytania dla {category.name}</h2>
      <ul className="space-y-6 min-w-full">
        {questions.map(({ id, content, answers }) => (
          <li key={id} className="p-6 rounded hover:bg-gray-900">
            <div className="flex gap-6 mb-8">
              <p className="content-center text-xl">{content}</p>
              <button className="font-bold tracking-wide py-1.5 px-3.5 text-lg rounded bg-blue-600 text-white hover:bg-blue-700">
                edytuj
              </button>
              <button className="font-bold tracking-wide py-1.5 px-3.5 text-lg rounded bg-red-600 text-white hover:bg-red-700">
                usuń
              </button>
            </div>
            <ul>
              {answers.map((an) => (
                <li
                  key={an.id}
                  className={clsx('flex gap-6 p-3 text-lg rounded-xl hover:bg-gray-950', {
                    'border-2 border-blue-500': an.is_correct
                  })}
                >
                  <p className="flex-1 content-center">{an.content}</p>
                  <button className="font-bold tracking-wide py-1.5 px-3.5 text-lg rounded bg-blue-600 text-white hover:bg-blue-700">
                    edytuj
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}
