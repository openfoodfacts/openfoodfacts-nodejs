import { Ingredient, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Ingredients {
  async getIngredients (): Promise<Taxonomy<Ingredient>> {
    return await getTaxo('ingredients')
  }
}
