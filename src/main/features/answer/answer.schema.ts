import { db } from '../../database/config'
import { tables } from '../../database/consts'

export const createTableAnswers = async () => {
  const existsAnswers = await db.schema.hasTable(tables.answers)

  if (!existsAnswers) {
    await db.schema.createTable(tables.answers, (table) => {
      table.uuid('id').primary().defaultTo(db.fn.uuid())
      table.string('content').notNullable()
      table.string('note').defaultTo(null)
      table.uuid('question_id').references('id').inTable(tables.questions).onDelete('CASCADE')
      table.boolean('is_correct').notNullable()
    })
  }
}
