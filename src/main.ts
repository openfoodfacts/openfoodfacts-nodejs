import createClient from "openapi-fetch";
import {
  paths as pathsv2,
  components as componentsv2,
  operations as operationsv2,
} from "./schemas/server/v2";

import {
  paths as pathsv3,
  operations as operationsv3,
  components as componentsv3,
} from "./schemas/server/v3";

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
export type SearchResultV2 = componentsv2["schemas"]["search_for_products"];

export type ProductV3 = componentsv3["schemas"]["product_v3"];
export type ResponseStatusV3 = componentsv3["schemas"]["response_status"];

// By default, use v2
export { ProductV2 as Product, SearchResultV2 as SearchResult };

export * from "./taxonomy/types";
export * from "./robotoff";
export * from "./folksonomy";
export * from "./prices";
export * from "./nutripatrol";
export * from "./search";
export * from "./products";

export type OpenFoodFactsOptions = {
  type?: BackendType;
  country?: string;
  host?: string;

  accessToken?: string;
  onAccessTokenExpired?: () => string | Promise<string>;
};

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  private readonly backendType?: BackendType;
  private readonly customUserAgent: string;
  private accessToken?: string;

  readonly rawV2: ReturnType<typeof createClient<pathsv2>>;
  readonly rawV3: ReturnType<typeof createClient<pathsv3>>;

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
    this.validateOptions(options);
    this.backendType = options.type;
    this.baseUrl = this.createBaseUrl(options);
    this.customUserAgent = this.createUserAgent();
    this.accessToken = options.accessToken;
    this.fetch = this.createFetchWrapper(fetch, options);

    this.rawV2 = createClient<pathsv2>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });

    this.rawV3 = createClient<pathsv3>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });

    this.robotoff = new Robotoff(fetch);
  }

  /**
   * Validates constructor options for mutual exclusivity
   */
  private validateOptions(options: OpenFoodFactsOptions): void {
    if (
      (options.host && options.country) ||
      (options.type && options.country)
    ) {
      throw new Error(
        "You must provide either `host`, `type`, or `country`, not multiple.",
      );
    }
  }

  /**
   * Creates the base URL based on options
   */
  private createBaseUrl(options: OpenFoodFactsOptions): string {
    if (options.host != null) {
      return options.host;
    }

    if (options.type != null) {
      const domain = BACKEND_DOMAINS[options.type];
      return `https://world.${domain}`;
    }

    return `https://${options.country || "world"}.openfoodfacts.org`;
  }

  /**
   * Creates the User-Agent string based on backend type
   */
  private createUserAgent(): string {
    const version = require("../package.json").version;

    if (this.backendType != null) {
      const backendName = BACKEND_NAMES[this.backendType];
      return `${backendName} - NodeJS ${version}`;
    }

    return `OpenFoodFacts - NodeJS ${version}`;
  }

  /**
   * Validates access token format and expiration
   */
  private validateAccessToken(token: string): void {
    if (typeof token !== "string") {
      throw new Error("Access token must be a string.");
    }

    if (token.length === 0) {
      throw new Error("Access token cannot be an empty string.");
    }

    if (!/^[A-Za-z0-9-_.]+$/.test(token)) {
      throw new Error(
        "Access token can only contain alphanumeric characters, dashes, underscores, and periods.",
      );
    }

    if (this.isTokenExpired(token)) {
      throw new Error("Access token is expired.");
    }
  }

  /**
   * Creates a fetch wrapper with User-Agent and optional token handling
   */
  private createFetchWrapper(
    fetch: typeof global.fetch,
    options: OpenFoodFactsOptions,
  ): typeof global.fetch {
    // Base fetch wrapper with User-Agent
    let wrappedFetch = this.createUserAgentFetch(fetch);

    // Add token handling if access token is provided
    if (options.accessToken != null) {
      this.validateAccessToken(options.accessToken);
      wrappedFetch = this.createTokenAwareFetch(wrappedFetch, options);
    }

    return wrappedFetch;
  }

  /**
   * Creates a fetch wrapper that adds User-Agent header
   */
  private createUserAgentFetch(
    fetch: typeof global.fetch,
  ): typeof global.fetch {
    return (url: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      headers.set("User-Agent", this.customUserAgent);
      return fetch(url, { ...init, headers });
    };
  }

  /**
   * Creates a fetch wrapper that handles token refresh and authorization
   */
  private createTokenAwareFetch(
    fetch: typeof global.fetch,
    options: OpenFoodFactsOptions,
  ): typeof global.fetch {
    return async (url: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);

      if (this.accessToken == null) {
        throw new Error("Access token was first specified and now is null.");
      }

      if (this.isTokenExpired(this.accessToken)) {
        this.accessToken = await this.refreshAccessToken(options);
      }

      headers.set("Authorization", `Bearer ${this.accessToken}`);
      return fetch(url, { ...init, headers });
    };
  }

  /**
   * Refreshes the access token using the provided callback
   */
  private async refreshAccessToken(
    options: OpenFoodFactsOptions,
  ): Promise<string> {
    if (options.onAccessTokenExpired == null) {
      throw new Error(
        "Access token expired and no handler provided to refresh it." +
          " You should provide `onAccessTokenExpired` option or wrap the fetch function to handle token expiration.",
      );
    }

    const newAccessToken = await options.onAccessTokenExpired();

    if (newAccessToken == null) {
      throw new Error(
        "onAccessTokenExpired handler did not return a new access token.",
      );
    }

    return newAccessToken;
  }

  private isTokenExpired(token: string) {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8"),
    ) as { exp: number };

    // Check if the token is expired
    return payload.exp && Date.now() >= payload.exp * 1000;
  }

  private async getTaxoEntry<T extends TaxoNode>(
    taxo: string,
    entry: string,
  ): Promise<T> {
    const res = await this.fetch(
      `${this.baseUrl}/api/v2/taxonomy?tagtype=${taxo}&tags=${entry}`,
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
   * Returns product details by barcode
   * @param barcode the product barcode
   */
  getProduct = this.getProductV2;

  async getProductV2(barcode: string) {
    const res = await this.rawV2.GET("/api/v2/product/{barcode}", {
      params: { path: { barcode } },
    });

    return res.data?.product;
  }

  /**
   * Returns product details by barcode with optional fields
   * @param barcode - The barcode of the product
   * @param query - An optional query object to filter the returned fields
   * @template T - An array of keys from ProductV3 to return
   * @example
   * ```typescript
   * const result = await client.getProductV3("1234567890123", { fields: ["product_name", "brands"] });
   * console.log(result.product.product_name, result.product.brands);
   * ```
   * @returns A promise that resolves to a product object with the specified fields or undefined if not found
   */
  async getProductV3<T extends Array<keyof ProductV3>>(
    barcode: string,
    query?: Omit<
      operationsv3["get-product-by-barcode"]["parameters"]["query"],
      "fields"
    > & {
      fields?: T;
    },
  ): Promise<
    (ResponseStatusV3 & { product: Pick<ProductV3, T[number]> }) | undefined
  > {
    const res = await this.rawV3.GET("/api/v3/product/{barcode}", {
      params: {
        path: { barcode },
        query: { ...query, fields: query?.fields?.join(",") },
      },
    });

    // @ts-expect-error - OpenAPI is wrong here!
    return res.data;
  }

  async performOCR(
    barcode: string,
    photoId: string,
    ocrEngine: "google_cloud_vision" = "google_cloud_vision",
  ): Promise<{ status?: number } | undefined> {
    const res = await this.rawV2.GET("/cgi/ingredients.pl", {
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
    const res = await this.rawV2.GET("/api/v2/product/{barcode}", {
      params: {
        query: { fields: "images" },
        path: { barcode },
      },
    });

    const product = res.data?.product;

    // Check if the returned type has images
    if (!product) return null;
    if (!("images" in product)) return null;

    const images = product.images ?? {};
    return Object.keys(images);
  }

  async search(query: operationsv2["get-search"]["parameters"]["query"]) {
    const res = await this.rawV2.GET("/api/v2/search", {
      params: { query },
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
