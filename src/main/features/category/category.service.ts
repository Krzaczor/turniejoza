import { db } from '../../database/config'
import { tables } from '../../database/consts'

export interface Category {
  id: string
  name: string
}

interface CreateCategory {
  name: string
}

export const categoryService = {
  async create(data: CreateCategory): Promise<Category> {
    return ((await db(tables.categories).returning('*').insert(data)) as Category[])[0]
  },

  async find(): Promise<Category[]> {
    return await db(tables.categories).select('*')
  },

  async findOne(id: string): Promise<Category | null> {
    const result = await db(tables.categories).select('*').where({ id }).first()
    return result || null
  },

  async findByName(name: string): Promise<Category | null> {
    const result = await db(tables.categories).select('*').where({ name }).first()
    return result || null
  },

  async findOrCreate(data: CreateCategory): Promise<Category> {
    const result = await categoryService.findByName(data.name)

    if (result) {
      return result
    }

    const category = await categoryService.create(data)
    return category
  }
}
