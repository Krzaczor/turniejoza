import { db } from '../../database/config'
import { tables } from '../../database/consts'
import { Answer, answerService } from '../answer/answer.service'

export interface Question {
  id: string
  content: string
  category: string
  answers: Answer[]
}

interface CreateQuestion {
  content: string
  category: string
}

interface CountQuestions {
  count: number
}

export const questionService = {
  async create(data: CreateQuestion): Promise<Question> {
    return ((await db(tables.questions).returning('*').insert(data)) as Question[])[0]
  },

  async find(): Promise<Question[]> {
    const questions = await db(tables.questions).select()

    for (const q of questions) {
      q.answers = await answerService.findByQuestion(q.id)
    }

    return questions
  },

  // async findOne(id: string): Promise<Question | null> {
  //   const question = await db(tables.questions).where('id', id).first()
  //   return question ? (question as Question) : null
  // },

  async count(): Promise<CountQuestions> {
    const data = await db(tables.questions).count('id as count').first()
    return { count: data ? +data.count : 0 }
  },

  async findByCategory(id: string): Promise<Question[]> {
    const questions = await db(tables.questions).select().where({ category: id })

    for (const q of questions) {
      q.answers = await answerService.findByQuestion(q.id)
    }

    return questions
  },

  async findByContent(content: string): Promise<Question | null> {
    const result = await db(tables.questions).where('content', content).first()
    return result || null
  },

  async findOrCreate(data: CreateQuestion): Promise<Question> {
    const result = await questionService.findByContent(data.content)

    if (result) {
      return result
    }

    const question = await questionService.create(data)
    return question
  },

  async removeByCategory(id: string): Promise<void> {
    const questions = await questionService.findByCategory(id)

    for (const question of questions) {
      await answerService.removeByQuestion(question.id)
    }

    await db(tables.questions).where('category', id).del()
  }
}
