import { db } from '../../database/config'
import { tables } from '../../database/consts'

export const createTableCategories = async () => {
  const existsCategories = await db.schema.hasTable(tables.categories)

  if (!existsCategories) {
    await db.schema.createTable(tables.categories, (table) => {
      table.uuid('id').primary().defaultTo(db.fn.uuid())
      table.string('name').notNullable()
    })
  }
}
