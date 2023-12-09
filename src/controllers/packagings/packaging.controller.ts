import { Ingredient, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Packagings {
  async getPackagings (): Promise<Taxonomy<Ingredient>> {
    return await getTaxo('packaging')
  }
}
