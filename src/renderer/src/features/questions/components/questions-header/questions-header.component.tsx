import { useQuery, useQueryClient } from '@tanstack/react-query'

const getCategory = async (id: string) => {
  return await window.api.categories.findOne(id)
}

const removeQuestions = async (id: string) => {
  return await window.api.questions.removeAll(id)
}

const getQuestionsByCategory = async (category_id: string) => {
  return await window.api.questions.findByCategory(category_id)
}

interface QuestionsHeaderProps {
  activeCategory: string
}

export const QuestionsHeader = ({ activeCategory }: QuestionsHeaderProps) => {
  const queryClient = useQueryClient()

  const { data: category } = useQuery<Category | null>({
    queryKey: ['category', activeCategory],
    queryFn: () => getCategory(activeCategory)
  })

  const { data: questions } = useQuery<Question[]>({
    queryKey: ['questions', activeCategory],
    queryFn: () => getQuestionsByCategory(activeCategory)
  })

  const removeAllQuestions = async () => {
    await removeQuestions(activeCategory)
    await queryClient.refetchQueries({
      queryKey: ['questions', activeCategory],
      type: 'active'
    })
  }

  // const exportQuestions = () => {
  //   if (!category) return
  //   window.electron.ipcRenderer.send('export-questions', category.id)
  // }

  return (
    <div className="flex gap-6 mb-6">
      <h2 className="flex-1 text-3xl py-1 font-bold content-center overflow-hidden whitespace-nowrap truncate">
        Pytania dla {category && category.name}
      </h2>
      {questions && category && questions.length > 0 && (
        <>
          {/* <button
            className="font-bold py-2 px-4 text-lg rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={exportQuestions}
          >
            Eksportuj
          </button> */}
          <button
            className="font-bold py-2 px-4 text-lg rounded bg-red-600 text-white hover:bg-red-700"
            onClick={removeAllQuestions}
          >
            Usuń pytania
          </button>
        </>
      )}
    </div>
  )
}
