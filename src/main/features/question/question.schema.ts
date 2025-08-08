import { db } from '../../database/config'
import { tables } from '../../database/consts'

export const createTableQuestions = async () => {
  const existsQuestions = await db.schema.hasTable(tables.questions)

  if (!existsQuestions) {
    await db.schema.createTable(tables.questions, (table) => {
      table.uuid('id').primary().defaultTo(db.fn.uuid())
      table.string('content').notNullable()
      table.uuid('category').references('id').inTable(tables.categories).onDelete('CASCADE')
    })
  }
}
