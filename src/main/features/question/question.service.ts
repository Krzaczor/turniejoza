import { db } from '../../database/config'
import { tables } from '../../database/consts'

export const questionService = {
  async findByCategory(id: string) {
    const questions = await db(tables.questions).select().where({ category_id: id })

    for (const q of questions) {
      const a = await db(tables.answers).where('question_id', q.id)
      q.answers = a
    }

    return questions
  }
}
