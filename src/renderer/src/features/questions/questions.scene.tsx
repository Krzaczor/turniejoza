import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { QuestionsList } from './components/questions-list/questions-list.component'
import { QuestionsHeader } from './components/questions-header/questions-header.component'
import { ButtonScene } from '@renderer/lib/react-scene'

const getCategories = async () => {
  return await window.api.categories.find()
}

export const useCategory = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => await getCategories()
  })
}

export const QuestionsScene = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const containerQuestionsRef = useRef<HTMLDivElement>(null!)

  const { data: categories, status: categoriesStatus, refetch } = useCategory()

  useEffect(() => {
    window.electron.ipcRenderer.on('insert-success', () => {
      refetch()
    })
  }, [])

  if (categoriesStatus === 'pending') {
    return <QuestionsSceneLoader />
  }

  if (categoriesStatus === 'error') {
    return <QuestionsSceneError />
  }

  const openUploadWindow = () => {
    window.electron.ipcRenderer.send('open-file-dialog')
  }

  const changeActiveCategory = (id: string) => {
    if (activeCategory === id) {
      return
    }

    setActiveCategory(id)
    containerQuestionsRef.current.scrollTo(0, 0)
  }

  return (
    <div className="flex fixed w-full h-[100vh]">
      {/* kontener na kategorie */}
      <div className="w-sm h-[100vh] p-6 flex flex-col border-r border-r-gray-500 overflow-auto">
        <div className="flex-1 overflow-auto">
          <div className="flex gap-6 justify-between mb-8">
            <h2 className="text-3xl font-bold">Kategorie</h2>
            <button
              className="font-bold py-2 px-4 text-lg rounded bg-blue-600 text-white hover:bg-blue-700"
              onClick={openUploadWindow}
            >
              Dodaj
            </button>
          </div>

          <ul>
            {categories.map(({ id, name }) => (
              <li
                key={id}
                className={clsx(
                  'py-3 px-4 rounded-lg text-xl my-3 overflow-hidden whitespace-nowrap truncate',
                  {
                    'bg-gray-300 text-black': activeCategory === id,
                    'hover:bg-gray-800': activeCategory !== id
                  }
                )}
                onClick={() => changeActiveCategory(id)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-32">
          <div className="fixed bottom-14 left-18 w-48">
            <ButtonScene
              scene="menu"
              className="px-6 py-4 rounded-lg text-white w-full text-xl border border-gray-500 hover:bg-blue-950"
            >
              Wróć do menu
            </ButtonScene>
          </div>
        </div>
      </div>

      {/* kontener na pytania */}
      <div ref={containerQuestionsRef} className="flex-1 p-6 overflow-auto">
        {activeCategory && <QuestionsHeader activeCategory={activeCategory} />}
        {activeCategory && <QuestionsList activeCategory={activeCategory} />}
      </div>
    </div>
  )
}

const QuestionsSceneLoader = () => {
  return <h1 className="text-4xl p-6">Ładowanie...</h1>
}

const QuestionsSceneError = () => {
  return (
    <div className="flex max-h-[100vh]">
      <p>Coś poszło nie tak</p>
      <button onClick={() => location.reload()}>Spróbuj ponownie</button>
    </div>
  )
}
