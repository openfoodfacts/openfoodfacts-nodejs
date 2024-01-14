import { Language, Taxonomy } from '../../taxonomy/types'
import { getTaxo, getTaxoEntry } from '../../taxonomy/api'

export class Languages {
  private readonly baseUrl

  constructor (baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getLanguages (): Promise<Taxonomy<Language>> {
    return await getTaxo('languages')
  }

  async getLanguage (languageName: string): Promise<Language> {
    return await getTaxoEntry(this.baseUrl, 'languages', languageName)
  }
}
