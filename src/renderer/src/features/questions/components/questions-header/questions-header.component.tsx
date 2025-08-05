import { useQuery } from '@tanstack/react-query'

const getCategory = async (id: string) => {
  return await window.api.categories.findOne(id)
}

interface QuestionsHeaderProps {
  activeCategory: string
}

export const QuestionsHeader = ({ activeCategory }: QuestionsHeaderProps) => {
  const { data: category } = useQuery<Category | null>({
    queryKey: ['category', activeCategory],
    queryFn: () => getCategory(activeCategory)
  })

  return (
    <div className="flex gap-6 mb-6">
      <h2 className="flex-1 text-3xl font-bold content-center overflow-hidden whitespace-nowrap truncate">
        Pytania dla {category && category.name}
      </h2>
      <button className="font-bold py-2 px-4 text-lg rounded bg-blue-600 text-white hover:bg-blue-700">
        Eksportuj
      </button>
      <button className="font-bold py-2 px-4 text-lg rounded bg-red-600 text-white hover:bg-red-700">
        Usuń pytania
      </button>
    </div>
  )
}
