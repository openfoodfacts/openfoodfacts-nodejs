import { STATIC_HOST } from "../consts.js";

export const TAXONOMY_URL = (taxo: string) =>
  `${STATIC_HOST}/data/taxonomies/${taxo}.json`;
