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
import {
  BackendType,
  BACKEND_DOMAINS,
  BACKEND_NAMES,
  PRODUCT_IMAGE_BASE_URL as IMAGE_BASE_URL,
} from "./consts";

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

export type OpenFoodFactsOptions = {
  type?: BackendType;
  country?: string;
  host?: string;
};

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  private readonly backendType?: BackendType;
  private readonly customUserAgent: string;

  /** Raw v2 client */
  readonly rawv2: ReturnType<typeof createClient<pathsv2>>;

  /** Robotoff API */
  readonly robotoff: Robotoff;

  /**
   * Create OFF object
   * @param fetch - Fetch implementation to use
   * @param options - Options for the OFF Object
   */
  constructor(
    fetch: typeof global.fetch,
    options: OpenFoodFactsOptions = { country: "world" },
  ) {
    if (
      (options.host && options.country) ||
      (options.type && options.country)
    ) {
      throw new Error(
        "You must provide either `host`, `type`, or `country`, not multiple.",
      );
    }

    this.backendType = options.type;
    this.fetch = fetch;

    if (options.host != null) {
      this.baseUrl = options.host;
    } else if (options.type != null) {
      const domain = BACKEND_DOMAINS[options.type];
      this.baseUrl = `https://world.${domain}`;
    } else {
      this.baseUrl = `https://${options.country}.openfoodfacts.org`;
    }

    if (this.backendType != null) {
      const backendName = BACKEND_NAMES[this.backendType];
      this.customUserAgent = `${backendName} - NodeJS ${require("../package.json").version}`;
    } else {
      this.customUserAgent = `OpenFoodFacts - NodeJS ${require("../package.json").version}`;
    }

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

    if (!res.data?.product?.images) return null;

    return Object.keys(res.data.product.images);
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

/**
 * Get base folder URL for a product's image
 * @param productCode Barcode of the product
 * @returns Folder path for the image files
 */
export function getProductImageFolder(productCode: string): string {
  if (!productCode) return "";
  // All but last 4 digits in 3-digit chunks, last 4 as one chunk
  const prefix = productCode.slice(0, -4);
  const suffix = productCode.slice(-4);
  const chunks: string[] = prefix.match(/.{1,3}/g) || [];
  if (suffix) chunks.push(suffix);
  return IMAGE_BASE_URL + "/" + chunks.join("/") + "/";
}

export default OpenFoodFacts;
