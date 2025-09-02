export type LocalizedString = { [lang: string]: string };

export type Taxonomy<T extends TaxoNode = TaxoNode> = Record<string, T>;

export type TaxoNode = {
  name: LocalizedString;
  parents?: string[];
  children?: string[];
  wikidata_category?: LocalizedString;
  wikidata?: LocalizedString;
  synonyms?: Record<string, string[]>;
};

export type Label = TaxoNode & {
  country?: LocalizedString;

  auth_url?: LocalizedString;
  auth_name?: LocalizedString;
  auth_address?: LocalizedString;

  exceptions?: LocalizedString;

  eu_groups?: LocalizedString;
};

export type Ingredient = TaxoNode & object;

export type State = TaxoNode & {};

export type Category = TaxoNode & {
  agribalyse_food_code?: LocalizedString;
  ciqual_food_name?: LocalizedString;
};

export type Store = TaxoNode & {
  country?: LocalizedString;
};

export type Brand = TaxoNode & {};

export type Additive = TaxoNode & {
  vegetarian?: LocalizedString;
  vegan?: LocalizedString;
  e_number?: LocalizedString;
};

export type Allergen = TaxoNode & {};

export type Nutrient = TaxoNode & {
  unit?: LocalizedString;
};

export type Language = TaxoNode & {
  language_code_2: { en: string };
  language_code_3: { en: string };
};

export type Country = TaxoNode & {
  country_code_3: { en: string };
  country_code_2: { en: string };
};
