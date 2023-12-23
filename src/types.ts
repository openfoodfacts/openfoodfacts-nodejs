import { components, external } from '../schemas/server/docs/api/ref/api'

export type Product = components['schemas']['Product']
export type SearchResult = external['responses/search_for_products.yaml']

export type Fetch = typeof fetch
