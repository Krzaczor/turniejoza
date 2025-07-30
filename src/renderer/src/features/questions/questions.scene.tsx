import { useState } from 'react'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { QuestionsList } from './components/questions-list/questions-list.component'

const getCategories = async () => {
  return await window.api.categories.find()
}

export const QuestionsScene = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { data: categories, status: categoriesStatus } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => await getCategories()
  })

  if (categoriesStatus === 'pending') {
    return <h1 className="text-4xl p-6">Ładowanie...</h1>
  }

  if (categoriesStatus === 'error') {
    return (
      <div className="flex max-h-[100vh]">
        <p>Coś poszło nie tak</p>
        <button onClick={() => location.reload()}>Spróbuj ponownie</button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex max-h-[100vh]">
        <p>Pusto, więc nic nie ma. Możesz zaimportować dane</p>
        <input type="file" />
      </div>
    )
  }

  const changeActiveCategory = (id: string) => {
    setActiveCategory(id)
  }

  return (
    <div className="flex fixed w-full h-[100vh]">
      {/* kontener na kategorie */}
      <div className="w-fit min-w-3xs h-[100vh] p-6 border-r border-r-gray-500 overflow-auto">
        <h2 className="text-3xl font-bold mb-8">Kategorie</h2>
        <ul className="min-w-full">
          {categories.map(({ id, name }) => (
            <li
              key={id}
              className={clsx('py-3 px-4 rounded-lg text-xl', {
                'bg-gray-300 text-black': activeCategory === id,
                'hover:bg-gray-800': activeCategory !== id
              })}
              onClick={() => changeActiveCategory(id)}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>

      {/* kontener na pytania */}
      <div className="w-full p-6 overflow-auto">
        {activeCategory && <QuestionsList activeCategory={activeCategory} />}
      </div>
    </div>
  )
}
