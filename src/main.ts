import createClient from "openapi-fetch";

import {
  paths as pathsv2,
  components as componentsv2,
  external as externalv2,
} from "$schemas/server/v2";

import { Robotoff } from "./robotoff";
import { TAXONOMY_URL } from "./taxonomy/api";
import {
  Additive,
  Allergen,
  Brand,
  Category,
  Country,
  Ingredient,
  Label,
  Language,
  State,
  Store,
  TaxoNode,
  Taxonomy,
} from "./taxonomy/types";
import { PLATFORM_DOMAINS, PLATFORM_NAMES } from "./consts";

export type ProductV2 = componentsv2["schemas"]["Product"];
export type SearchResultV2 = externalv2["responses/search_for_products.yaml"];

// By default, use v2
export { ProductV2 as Product, SearchResultV2 as SearchResult };

export * from "./taxonomy/types";
export * from "./robotoff";
export * from "./folksonomy";
export * from "./prices";
export * from "./nutripatrol";
export * from "./search";

export type PlatformType = "food" | "beauty" | "petfood" | "products";

export type OpenFoodFactsOptions = {
  country: string;
  platform?: PlatformType;
};

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  private readonly platform: PlatformType;
  private readonly customUserAgent: string;

  /** Raw v2 client */
  readonly rawv2: ReturnType<typeof createClient<pathsv2>>;

  /** Robotoff API */
  readonly robotoff: Robotoff;

  /**
   * Create OFF object
   * @param options - Options for the OFF Object
   */
  constructor(
    fetch: typeof global.fetch,
    options: OpenFoodFactsOptions = { country: "world", platform: "food" },
  ) {
    this.platform = options.platform || "food";

    const domain =
      this.platform === "food"
        ? PLATFORM_DOMAINS.FOOD
        : this.platform === "beauty"
          ? PLATFORM_DOMAINS.BEAUTY
          : this.platform === "petfood"
            ? PLATFORM_DOMAINS.PET_FOOD
            : PLATFORM_DOMAINS.PRODUCTS;

    this.baseUrl = `https://${options.country}.${domain}`;
    this.fetch = fetch;

    const platformName =
      this.platform === "food"
        ? PLATFORM_NAMES.FOOD
        : this.platform === "beauty"
          ? PLATFORM_NAMES.BEAUTY
          : this.platform === "petfood"
            ? PLATFORM_NAMES.PET_FOOD
            : PLATFORM_NAMES.PRODUCTS;

    this.customUserAgent = `${platformName} - NodeJS ${require("../package.json").version}`;

    this.rawv2 = createClient<pathsv2>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
      headers: {
        "User-Agent": this.customUserAgent,
      },
    });

    this.robotoff = new Robotoff(fetch);
  }

  private async getTaxoEntry<T extends TaxoNode>(
    taxo: string,
    entry: string,
  ): Promise<T> {
    const res = await fetch(
      `${this.baseUrl}/api/v2/taxonomy?tagtype=${taxo}&tags=${entry}`,
      { headers: { "User-Agent": this.customUserAgent } },
    );

    return (await res.json()) as T;
  }

  getBrand(brandName: string): Promise<Brand> {
    return this.getTaxoEntry("brands", brandName);
  }

  getLanguage(languageName: string): Promise<Language> {
    return this.getTaxoEntry("languages", languageName);
  }

  getBrands(): Promise<Taxonomy<Brand>> {
    return this.getTaxo<Brand>("brands");
  }
  getLanguages(): Promise<Taxonomy<Language>> {
    return this.getTaxo<Language>("languages");
  }
  getLabels(): Promise<Taxonomy<Label>> {
    return this.getTaxo<Label>("labels");
  }
  getAdditives(): Promise<Taxonomy<Additive>> {
    return this.getTaxo<Additive>("additives");
  }
  getAllergens(): Promise<Taxonomy<Allergen>> {
    return this.getTaxo<Allergen>("allergens");
  }
  getCategories(): Promise<Taxonomy<Category>> {
    return this.getTaxo<Category>("categories");
  }
  getCountries(): Promise<Taxonomy<Country>> {
    return this.getTaxo<Country>("countries");
  }
  getIngredients(): Promise<Taxonomy<Ingredient>> {
    return this.getTaxo<Ingredient>("ingredients");
  }
  getPackagings(): Promise<Taxonomy<Ingredient>> {
    return this.getTaxo<Ingredient>("packaging");
  }
  getStates(): Promise<Taxonomy<State>> {
    return this.getTaxo<State>("states");
  }
  getStores(): Promise<Taxonomy<Store>> {
    return this.getTaxo<Store>("stores");
  }

  async getTaxo<T extends TaxoNode>(taxo: string): Promise<Taxonomy<T>> {
    const res = await this.fetch(TAXONOMY_URL(taxo));
    return (await res.json()) as Taxonomy<T>;
  }

  /**
   * It is used to get a specific product using barcode
   * @param barcode Barcode of the product you want to fetch details
   */
  async getProduct(barcode: string): Promise<ProductV2 | undefined> {
    const res = await this.rawv2.GET("/api/v2/product/{barcode}", {
      params: { path: { barcode } },
    });

    return res.data?.product;
  }

  async performOCR(
    barcode: string,
    photoId: string,
    ocrEngine: "google_cloud_vision" = "google_cloud_vision",
  ): Promise<{ status?: number } | undefined> {
    const res = await this.rawv2.GET("/cgi/ingredients.pl", {
      params: {
        query: {
          code: barcode,
          id: photoId,
          ocr_engine: ocrEngine,
          process_image: "1",
        },
      },
    });

    return res.data;
  }

  async getProductImages(barcode: string): Promise<string[] | null> {
    const res = await this.rawv2.GET("/api/v2/product/{barcode}", {
      params: {
        query: {
          fields: "images",
        },
        path: { barcode },
      },
    });

    if (!res.data?.product) {
      return null;
    } else if (!res.data?.product?.images) {
      return null;
    }

    const imgObj = res.data?.product?.images;
    return Object.keys(imgObj);
  }

  async search(
    fields?: string,
    sortBy?: componentsv2["parameters"]["sort_by"],
  ): Promise<SearchResultV2 | undefined> {
    const res = await this.rawv2.GET("/api/v2/search", {
      params: { query: { fields, sort_by: sortBy } },
    });

    return res.data;
  }
}

export default OpenFoodFacts;
