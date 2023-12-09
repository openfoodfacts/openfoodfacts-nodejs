import { Store, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Stores {
  async getStores (): Promise<Taxonomy<Store>> {
    return await getTaxo('stores')
  }
}
