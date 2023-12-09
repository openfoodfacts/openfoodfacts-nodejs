import { State, Taxonomy } from '../../taxonomy/types'
import { getTaxo } from '../../taxonomy/api'

export class States {
  async getStates (): Promise<Taxonomy<State>> {
    return await getTaxo('states')
  }
}
