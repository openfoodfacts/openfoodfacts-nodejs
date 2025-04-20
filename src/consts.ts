/* eslint-disable no-unused-vars */
export const STATIC_HOST = "https://static.openfoodfacts.org";

export const USER_AGENT = `OpenFoodFacts - NodeJS ${require("../package.json").version}`;

export const PLATFORM_DOMAINS = {
  FOOD: "openfoodfacts.org",
  BEAUTY: "openbeautyfacts.org",
  PET_FOOD: "openpetfoodfacts.org",
  PRODUCTS: "openproductsfacts.org",
};

export const PLATFORM_NAMES = {
  FOOD: "OpenFoodFacts",
  BEAUTY: "OpenBeautyFacts",
  PET_FOOD: "OpenPetFoodFacts",
  PRODUCTS: "OpenProductsFacts",
};

export enum PlatformFeature {
  NUTRISCORE = "nutriscore",
  ECOSCORE = "ecoscore",
  NOVA = "nova",
  KNOWLEDGE_PANELS = "knowledge_panels",
}

export const PLATFORM_FEATURES: Record<string, PlatformFeature[]> = {
  food: [
    PlatformFeature.NUTRISCORE,
    PlatformFeature.ECOSCORE,
    PlatformFeature.NOVA,
    PlatformFeature.KNOWLEDGE_PANELS,
  ],
  beauty: [],
  petfood: [],
  products: [],
};
