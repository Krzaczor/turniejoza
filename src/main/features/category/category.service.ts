import { db } from '../../database/config'
import { tables } from '../../database/consts'

export const categoryService = {
  async find() {
    return await db(tables.categories).select('*')
  },

  async findOne(id: string) {
    return await db(tables.categories).select('*').where({ id }).first()
  }
}
