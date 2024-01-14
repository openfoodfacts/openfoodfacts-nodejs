import { STATIC_HOST } from '../consts'
import axios from 'axios'
import { TaxoNode, Taxonomy } from './types'

export async function getTaxo<T extends TaxoNode> (
  taxo: string
): Promise<Taxonomy<T>> {
  const { data } = await axios.get(`${STATIC_HOST}/data/taxonomies/${taxo}.json`)
  return data as Taxonomy<T>
}

export async function getTaxoEntry<T extends TaxoNode> (
  baseUrl: string,
  taxo: string,
  entry: string
): Promise<T> {
  const { data } = await axios.get(`${baseUrl}/api/v2/taxonomy?tagtype=${taxo}&tags=${entry}`)
  return data as T
}
