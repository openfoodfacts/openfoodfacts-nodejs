import { Additive, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Additives {
  async getAdditives (): Promise<Taxonomy<Additive>> {
    return await getTaxo('additives')
  }
}
