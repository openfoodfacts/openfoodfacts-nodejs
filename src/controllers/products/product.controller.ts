import createClient from 'openapi-fetch'

import { components, paths } from '../../../schemas/server/docs/api/ref/api'
import { Fetch, Product, SearchResult } from '../../types'

export class Products {
  private readonly client: ReturnType<typeof createClient<paths>>

  constructor (baseUrl: string, fetch?: Fetch) {
    this.client = createClient<paths>({
      baseUrl,
      fetch
    })
  }

  /**
   * It is used to get a specific product using barcode
   * @param barcode Barcode of the product you want to fetch details
   */
  async getProduct (barcode: string): Promise<Product | undefined> {
    const { data } = await this.client.GET('/api/v2/product/{barcode}', {
      params: { path: { barcode } }
    })

    return data?.product
  }

  async performOCR (
    barcode: string,
    photoId: string,
    ocrEngine: 'google_cloud_vision' = 'google_cloud_vision'
  ): Promise<{ status?: number | undefined } | undefined> {
    const { data } = await this.client.GET('/cgi/ingredients.pl', {
      params: {
        query: {
          code: barcode,
          id: photoId,
          ocr_engine: ocrEngine,
          process_image: '1'
        }
      }
    })

    return data
  }

  async search (
    fields: string,
    sortBy: components['parameters']['sort_by']
  ): Promise<SearchResult | undefined> {
    const { data } = await this.client.GET('/api/v2/search', {
      params: { query: { fields, sort_by: sortBy } }
    })

    return data
  }

  /**
   * It is used to get all products beginning with the given barcode string
   * @param {string} beginning - Barcode string from which if the barcode begins, then product is to be fetched
   * @return {Object} It returns a JSON of all products that begin with the given barcode string

   */
  async getProductsByBarcodeBeginning (beginning: string): Promise<Product | undefined> {
    const fill = 'x'.repeat(13 - beginning.length)
    const barcode = beginning.concat(fill)
    return await this.getProduct(barcode)
  }
}
