import { STATIC_HOST } from "../consts";

export const TAXONOMY_URL = (taxo: string) =>
  `${STATIC_HOST}/data/taxonomies/${taxo}.json`;
