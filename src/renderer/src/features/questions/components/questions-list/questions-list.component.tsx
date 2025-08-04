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
      <ol className="space-y-2 min-w-full list-decimal list-inside text-xl">
        {questions.map(({ id, content, answers }) => (
          <li key={id} className="p-4 rounded-xl hover:bg-gray-900">
            <span className="inline-block content-center mb-6 pl-2">{content}</span>
            <ol className="list-[upper-alpha] list-inside">
              {answers.map((an) => (
                <li
                  key={an.id}
                  className={clsx('py-2.5 px-4 text-lg rounded-xl', {
                    'border-2 border-blue-500': an.is_correct
                  })}
                >
                  <span className="content-center font-bold ml-2">{an.content}</span>
                  {an.note && <span className="pl-6">[ {an.note} ]</span>}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  )
}
