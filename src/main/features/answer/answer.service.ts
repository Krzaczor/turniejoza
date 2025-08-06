import { db } from '../../database/config'
import { tables } from '../../database/consts'

interface Answer {
  id: string
  content: string
  note: string | null
  is_correct: boolean
  question_id: string
}

interface CreateAnswer {
  content: string
  note: string | null
  is_correct: boolean
  question_id: string
}

export const answerService = {
  async create(data: CreateAnswer): Promise<Answer> {
    return ((await db(tables.answers).returning('*').insert(data)) as Answer[])[0]
  },

  async findByQuestion(id: string): Promise<Answer[]> {
    const answers = await db(tables.answers).select().where({ question_id: id })
    return answers
  },

  async findByContent(content: string): Promise<Answer | null> {
    const result = await db(tables.answers).where('content', content).first()
    return result || null
  },

  async findOrCreate(data: CreateAnswer): Promise<Answer> {
    const result = await answerService.findByContent(data.content)

    if (result) {
      return result
    }

    const answer = await answerService.create(data)
    return answer
  },

  async removeByQuestion(id: string): Promise<void> {
    await db(tables.answers).where('question_id', id).del()
  }
}
