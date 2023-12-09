import { paths } from '../schemas/robotoff'
import createClient from 'openapi-fetch'

export class Robotoff {
  private readonly client: ReturnType<typeof createClient<paths>>

  constructor (
    baseUrl: string
  ) {
    this.client = createClient<paths>({
      baseUrl
    })
  }

  async annotate (
    body: paths['/insights/annotate']['post']['requestBody']['content']['application/x-www-form-urlencoded']
  ): Promise<any> {
    const { data } = await this.client.post('/insights/annotate', {
      body
    })
    return data
  }

  async questionsByProductCode (code: number): Promise<any> {
    const { data } = await this.client.get('/questions/{barcode}', {
      params: {
        path: { barcode: code }
      }
    })
    return data
  }

  async insightDetail (id: string): Promise<any> {
    const { data } = await this.client.get('/insights/detail/{id}', {
      params: { path: { id } }
    })
    return data
  }

  async loadLogo (logoId: string): Promise<any> {
    // @ts-expect-error TODO: still not documented
    const { data } = await this.client.get('/images/logos/{logoId}', {
      params: {
        path: { logoId }
      }
    })
    return data
  }
}
