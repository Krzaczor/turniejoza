import { type Category, categoryService } from '../category/category.service'
import { type Question, questionService } from '../question/question.service'

interface Database {
  categories: Category[]
  questions: Question[]
}

export const databaseService = {
  async all(): Promise<Database> {
    // const categories = await categoryService.find()
    // const questions = await questionService.find()

    const [categories, questions] = await Promise.all([
      categoryService.find(),
      questionService.find()
    ])

    return {
      categories,
      questions
    }
  }
}
