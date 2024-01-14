import { Country, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Countries {
  async getCountries (): Promise<Taxonomy<Country>> {
    return await getTaxo('countries')
  }
}
