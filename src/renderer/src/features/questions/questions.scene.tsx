import { useEffect, useState } from 'react'
import clsx from 'clsx'

const getCategories = async () => {
  return await window.api.categories.find()
}

const getCategory = async (id: string) => {
  return await window.api.categories.findOne(id)
}

const getQuestionsByCategory = async (category_id: string) => {
  return await window.api.questions.findByCategory(category_id)
}

export const QuestionsScene = () => {
  const [categories, setCategories] = useState([])
  const [questions, setQuestions] = useState([])
  const [activeCategory, setActiveCategory] = useState<any>(null)

  useEffect(() => {
    getCategories()
      .then((result) => {
        setCategories(result)
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    if (activeCategory === null) {
      setQuestions([])
      return
    }

    getQuestionsByCategory(activeCategory.id).then((result) => {
      setQuestions(result)
    })
  }, [activeCategory])

  const changeActiveCategory = (id: string) => {
    getCategory(id).then((result) => {
      setActiveCategory(result)
    })
  }

  return (
    <div className="flex max-h-[100vh]">
      {/* kontener na kategorie */}
      <div className="w-fit min-w-3xs h-[100vh] p-6 border-r border-r-gray-500 overflow-auto">
        <h2 className="text-3xl font-bold mb-8">Kategorie</h2>
        <ul className="min-w-full">
          {categories.map(({ id, name }) => (
            <li
              key={id}
              className={clsx('py-3 px-4 rounded-lg text-xl', {
                'bg-gray-300 text-black': activeCategory?.id === id,
                'hover:bg-gray-800': activeCategory?.id !== id
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
        {activeCategory && (
          <>
            <h2 className="text-3xl font-bold mb-6">Pytania dla {activeCategory.name}</h2>
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
        )}
      </div>
    </div>
  )
}
