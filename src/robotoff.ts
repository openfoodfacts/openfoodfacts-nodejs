import { paths } from '../schemas/robotoff'
import createClient from 'openapi-fetch'
import { Fetch } from './types'

export class Robotoff {
  private readonly client: ReturnType<typeof createClient<paths>>

  constructor (
    baseUrl: string,
    fetch?: Fetch
  ) {
    this.client = createClient<paths>({
      baseUrl,
      fetch
    })
  }

  async annotate (
    body: paths['/insights/annotate']['post']['requestBody']['content']['application/x-www-form-urlencoded']
  ): Promise<any> {
    const { data } = await this.client.POST('/insights/annotate', {
      body
    })
    return data
  }

  async questionsByProductCode (code: number): Promise<any> {
    const { data } = await this.client.GET('/questions/{barcode}', {
      params: {
        path: { barcode: code }
      }
    })
    return data
  }

  async insightDetail (id: string): Promise<any> {
    const { data } = await this.client.GET('/insights/detail/{id}', {
      params: { path: { id } }
    })
    return data
  }

  async loadLogo (logoId: string): Promise<any> {
    // @ts-expect-error TODO: still not documented
    const { data } = await this.client.GET('/images/logos/{logoId}', {
      params: {
        path: { logoId }
      }
    })
    return data
  }
}
