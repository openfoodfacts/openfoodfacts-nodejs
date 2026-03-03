import { STATIC_HOSTS, BackendType } from "../consts.js";

export const TAXONOMY_URL = (
  taxo: string,
  type: BackendType = BackendType.OFF,
) => `${STATIC_HOSTS[type]}/data/taxonomies/${taxo}.json`;
