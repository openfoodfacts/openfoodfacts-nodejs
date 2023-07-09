export type LocalizedString = Record<string, string>;

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
  country: LocalizedString;
  auth_url: LocalizedString;
};

export type Country = TaxoNode & object;

export type Ingredient = TaxoNode & object;

export type State = TaxoNode & object;

export type Category = TaxoNode & {
  agribalyse_food_code?: LocalizedString;
  ciqual_food_name?: LocalizedString;
};

export type Store = TaxoNode & object;

export type Brand = TaxoNode & object;

export type Additive = TaxoNode & object;

export type Allergen = TaxoNode & object;

export type Language = TaxoNode & {
  language_code_2: {
    en: string;
  };
  language_code_3: {
    en: string;
  };
};
