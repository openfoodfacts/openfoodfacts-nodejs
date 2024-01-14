import { Brand, Taxonomy } from '../../taxonomy/types'
import { getTaxo, getTaxoEntry } from '../../taxonomy/api'

export class Brands {
  private readonly baseUrl

  constructor (baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getBrands (): Promise<Taxonomy<Brand>> {
    return await getTaxo('brands')
  }

  async getBrand (brandName: string): Promise<Object> {
    return await getTaxoEntry(this.baseUrl, 'brands', brandName)
  }
}
