import type { Product } from "./off.js";

export const FACETS_SORT_OPTIONS = [
  "last_modified_t",
  "popularity",
  "environmental_score_score",
  "created_t",
] as const;

export type FacetSortOption = (typeof FACETS_SORT_OPTIONS)[number];

export type FacetResponse = {
  count: number;
  tags: { id: string; known: number; name: string; products: number }[];
};

export type FacetValueResponse = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: Product[];
};
