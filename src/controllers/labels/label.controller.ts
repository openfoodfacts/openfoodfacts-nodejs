import { Label, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class Labels {
  async getLabels (): Promise<Taxonomy<Label>> {
    return await getTaxo('labels')
  }
}
