import { STATIC_HOST } from "../consts";
import { TaxoNode, Taxonomy } from "./types";

export const TAXONOMY_URL = (taxo: string) =>
  `${STATIC_HOST}/data/taxonomies/${taxo}.json`;

export async function getTaxo<T extends TaxoNode>(
  taxo: string,
  fetch: (url: string, options?: RequestInit) => Promise<Response>
): Promise<Taxonomy<T>> {
  const res = await fetch(TAXONOMY_URL(taxo));
  return (await res.json()) as Taxonomy<T>;
}
