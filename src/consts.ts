/* eslint-disable no-unused-vars */
export const STATIC_HOST = "https://static.openfoodfacts.org";

export const USER_AGENT = `OpenFoodFacts - NodeJS ${require("../package.json").version}`;

export enum BackendType {
  OFF = "OFF",
  OBF = "OBF",
  OPFF = "OPFF",
  OPF = "OPF",
}

export const BACKEND_DOMAINS = {
  [BackendType.OFF]: "openfoodfacts.org",
  [BackendType.OBF]: "openbeautyfacts.org",
  [BackendType.OPFF]: "openpetfoodfacts.org",
  [BackendType.OPF]: "openproductsfacts.org",
};

export const BACKEND_NAMES = {
  [BackendType.OFF]: "OpenFoodFacts",
  [BackendType.OBF]: "OpenBeautyFacts",
  [BackendType.OPFF]: "OpenPetFoodFacts",
  [BackendType.OPF]: "OpenProductsFacts",
};
