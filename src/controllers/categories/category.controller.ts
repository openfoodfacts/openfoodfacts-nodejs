import { Category, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Categories {
  async getCategories (): Promise<Taxonomy<Category>> {
    return await getTaxo('categories')
  }
}
