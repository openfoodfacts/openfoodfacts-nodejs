import {
  PRODUCT_IMAGE_URL,
  BackendType,
  BACKEND_DOMAINS,
  BACKEND_NAMES,
} from "./consts.js";

import { Robotoff } from "./robotoff.js";

import { TAXONOMY_URL } from "./taxonomy/api.js";
import type {
  Additive,
  Allergen,
  Brand,
  Category,
  Country,
  Ingredient,
  Label,
  Language,
  Nutrient,
  State,
  Store,
  TaxoNode,
  Taxonomy,
} from "./taxonomy/types.js";

import type { RawImage, SelectedImage } from "./types.js";

import type {
  FacetResponse,
  FacetSortOption,
  FacetValueResponse,
} from "./facets.js";
export type { FacetResponse, FacetSortOption, FacetValueResponse };

import {
  ProductOpenerApiV2,
  getProductNameInLang,
  getProductIngredientsInLang,
} from "./off-v2.js";
import { ProductOpenerApiV3 } from "./off-v3.js";
export { getProductNameInLang, getProductIngredientsInLang };

// Type-only imports and re-exports for off-v2.js
import type {
  SearchQuery as SearchQueryV2,
  Product as ProductV2,
  SearchResult as SearchResultV2,
  ProductAttribute as ProductAttributeV2,
  Attribute as AttributeV2,
} from "./off-v2.js";
export type {
  SearchQueryV2,
  ProductV2,
  SearchResultV2,
  ProductAttributeV2,
  AttributeV2,
};

// Type-only imports and re-exports for off-v3.js
import type {
  ProductDataType,
  ProductDataSection,
  ProductImageUploadParams as ProductImageUploadParamsV3,
  ProductQuery as ProductQueryV3,
  Product as ProductV3,
  ProductState as ProductStateV3,
  ResponseStatus as ResponseStatusV3,
} from "./off-v3.js";
export type {
  ProductDataType,
  ProductDataSection,
  ProductImageUploadParamsV3,
  ProductQueryV3,
  ProductV3,
  ProductStateV3,
  ResponseStatusV3,
};

import { VERSION } from "./version.js";

// By default, use v2
export type { ProductV2 as Product, SearchResultV2 as SearchResult };

export type OpenFoodFactsOptions = {
  type?: BackendType;
  country?: string;
  language?: string;
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
  private readonly defaultOptions: {
    lang?: string;
    country?: string;
    username?: string;
    password?: string;
  };

  /** The V2 ProductOpener API class. Do not use directly unless you know what you're doing.  */
  readonly apiv2: ProductOpenerApiV2;
  /** The V3 ProductOpener API class. Do not use directly unless you know what you're doing. */
  readonly apiv3: ProductOpenerApiV3;

  /** The Robotoff API class. */
  readonly robotoff: Robotoff;

  /**
   * Create OFF object
   * @param fetch - Fetch implementation to use
   * @param options - Options for the OFF Object
   */
  constructor(
    fetch: typeof global.fetch,
    options: OpenFoodFactsOptions = { country: "world", language: "en" },
  ) {
    this.validateOptions(options);
    this.backendType = options.type;
    this.baseUrl = this.createBaseUrl(options);
    this.customUserAgent = this.createUserAgent();
    this.accessToken = options.accessToken;
    this.fetch = this.createFetchWrapper(fetch, options);
    this.defaultOptions = {
      lang: options.language,
      country: options.country,
      username: undefined,
      password: undefined,
    };

    this.apiv2 = new ProductOpenerApiV2(this.fetch, { host: this.baseUrl });
    this.apiv3 = new ProductOpenerApiV3(this.fetch, { host: this.baseUrl });
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
    if (this.backendType != null) {
      const backendName = BACKEND_NAMES[this.backendType];
      return `${backendName} - NodeJS ${VERSION}`;
    }

    return `OpenFoodFacts - NodeJS ${VERSION}`;
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
    fetch: typeof globalThis.fetch,
  ): typeof globalThis.fetch {
    return (
      url: string | URL | globalThis.Request,
      init?: globalThis.RequestInit,
    ) => {
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
    return async (
      url: string | URL | globalThis.Request | URL,
      init?: globalThis.RequestInit,
    ) => {
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

  ////////////////
  // TAXONOMIES
  ////////////////

  getBrand(brandName: string): Promise<Brand> {
    return this.apiv2.getTaxoEntry("brands", brandName);
  }

  getLanguage(languageName: string): Promise<Language> {
    return this.apiv2.getTaxoEntry("languages", languageName);
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

  getNutrients(): Promise<Taxonomy<Nutrient>> {
    return this.getTaxo<Nutrient>("nutrients");
  }

  async getTaxo<T extends TaxoNode>(taxo: string): Promise<Taxonomy<T>> {
    const res = await this.fetch(TAXONOMY_URL(taxo));
    return (await res.json()) as Taxonomy<T>;
  }

  ///////////
  // API V2
  ///////////

  performOCR = (
    barcode: string,
    photoId: string,
    ocrEngine?: "google_cloud_vision",
  ) => this.apiv2.performOCR(barcode, photoId, ocrEngine);

  search = (query: SearchQueryV2) => this.apiv2.search(query);

  /**
   * Returns all available attribute groups
   * @returns A promise that resolves to an array of attribute groups
   */
  getAttributeGroups = () => this.apiv2.getAttributeGroups();

  /**
   * Returns product attributes for a given barcode
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to an array of product attributes
   */
  getProductAttributes = (barcode: string) =>
    this.apiv2.getProductAttributes(barcode);

  /**
   * Returns product details by barcode with optional fields
   * @param barcode - The barcode of the product
   * @param query - An optional query object to filter the returned fields
   * @template T - An array of keys from ProductV3 to return
   * @example
   * ```typescript
   * const result = await api.getProductV3("1234567890123", { fields: ["product_name", "brands"] });
   * console.log(result.product.product_name, result.product.brands);
   * ```
   * @returns A promise that resolves to a product object with the specified fields or undefined if not found
   */
  getProductV3 = <T extends Array<keyof ProductV3 | "all">>(
    barcode: string,
    query?: Omit<ProductQueryV3, "fields"> & { fields?: T },
  ) => this.apiv3.getProductV3(barcode, query);

  /**
   * Adds or edits a product using the V2 API
   * @param product - The product data to add or edit
   * @param credentials - Optional credentials for authentication
   * @returns A promise that resolves to true if successful, false otherwise
   */
  addOrEditProductV2 = (
    product: ProductDataType & { comment?: string },
    credentials?: { username: string; password: string },
  ) => {
    const username = credentials?.username ?? this.defaultOptions.username;
    const password = credentials?.password ?? this.defaultOptions.password;

    const nullableCredentials =
      username != null && password != null ? { username, password } : undefined;
    return this.apiv2.addOrEditProductV2(product, nullableCredentials);
  };

  /**
   * Uploads an image to OpenFoodFacts for a product.
   * @param barcode - The barcode of the product
   * @param imageFile - The image file to upload
   * @param imagefield - The field name for the image (e.g., "front", "ingredients", "nutrition")
   * @returns A promise that resolves to the upload response
   */
  uploadImage = (barcode: string, imageFile: File, imagefield: string) =>
    this.apiv2.uploadImage(barcode, imageFile, imagefield);

  /**
   * Crops and selects an image for a product
   * @param barcode - The barcode of the product
   * @param imgid - Identifier of the image to select (should be a number)
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param cropData - Crop coordinates and options
   * @returns A promise that resolves to the crop response
   */
  cropImage = (
    barcode: string,
    imgid: number,
    id: string,
    cropData: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      angle?: number;
      normalize?: boolean;
      white_magic?: boolean;
      comment?: string;
      app_name?: string;
      app_version?: string;
      app_uuid?: string;
      user_agent?: string;
    },
  ) => this.apiv2.cropImage(barcode, imgid, id, cropData);

  /**
   * Rotates an image for a product
   * @param barcode - The barcode of the product
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param imgid - Identifier of the image to rotate (should be a number as string)
   * @param angle - Angle of rotation in degrees (90, 180, or 270 clockwise)
   * @returns A promise that resolves to the rotation response
   */
  rotateImage = (barcode: string, id: string, imgid: string, angle: string) =>
    this.apiv2.rotateImage(barcode, id, imgid, angle);

  /**
   * Unselects an image for a product
   * @param barcode - The barcode of the product
   * @param id - Image field (image id) of the photo to unselect (e.g., "front_fr")
   * @returns A promise that resolves to the unselect response
   */
  unselectImage = (barcode: string, id: string) =>
    this.apiv2.unselectImage(barcode, id);

  /**
   * Deletes an uploaded image for a product
   * @param barcode - The barcode of the product corresponding to the image
   * @param imgid - The id of the image to be deleted
   * @returns A promise that resolves to the deletion response
   */
  deleteProductImage = (barcode: string, imgid: number) =>
    this.apiv3.deleteProductImage(barcode, imgid);

  /**
   *
   * @param barcode
   * @param params
   * @returns
   */
  uploadProductImage = (barcode: string, params: ProductImageUploadParamsV3) =>
    this.apiv3.uploadProductImage(barcode, params);

  /**
   * Returns product data using the V2 API
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to the product data or undefined if not found
   */
  getProductV2 = (barcode: string) => this.apiv2.getProductV2(barcode);

  /**
   * Returns an array of image names for the product
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to an array of image names or null if not found
   */
  getProductImages = (barcode: string) => this.apiv2.getProductImages(barcode);

  async getFacet(
    facet: string,
    opts?: { page?: number; pageSize?: number; sortBy?: FacetSortOption },
  ): Promise<FacetResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set("page", `${opts.page}`);
    if (opts?.pageSize) params.set("page_size", `${opts.pageSize}`);
    if (opts?.sortBy) params.set("sort_by", opts.sortBy);

    const res = await this.fetch(
      `${this.baseUrl}/facets/${facet}.json?${params}`,
    );
    return (await res.json()) as FacetResponse;
  }

  async getFacetValue(
    facet: string,
    value: string,
    opts: { page?: number; pageSize?: number; sortBy?: FacetSortOption },
  ): Promise<FacetValueResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set("page", `${opts.page}`);
    if (opts?.pageSize) params.set("page_size", `${opts.pageSize}`);
    if (opts?.sortBy) params.set("sort_by", opts.sortBy);

    const res = await this.fetch(
      `${this.baseUrl}/facets/${facet}/${value}.json?${params}`,
    );
    return (await res.json()) as FacetValueResponse;
  }
}

export type ProductSearch<T = ProductDataType> = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: T[];
  skip: number;
};

export default OpenFoodFacts;

/**
 * Gets URL for a product image based on its barcode and image name
 * @param barcode - Product barcode
 * @param imageName - Name of the image (e.g., "front", "ingredients", "nutrition")
 * @param images - Image metadata from product data
 * @param size - Image size (100, 200, 400, or full) - defaults to 400
 * @returns Complete URL to the specific image or null if not found
 */
export function getProductImageUrl(
  barcode: string,
  imageName: string,
  images: Record<string, SelectedImage | RawImage>,
  size: "100" | "200" | "400" | "full" = "400",
): string | null {
  const paddedBarcode = barcode.toString().padStart(13, "0");
  const match = paddedBarcode.match(/^(.{3})(.{3})(.{3})(.*)$/);
  if (!match) {
    throw new Error(`Invalid barcode format: ${paddedBarcode}`);
  }

  const path = `${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
  const image = images[imageName];

  if (!image) {
    return null;
  }

  const rev = (image as SelectedImage).rev;
  let filename: string;
  if (rev) {
    filename = `${imageName}.${rev}.${size}.jpg`;
  } else {
    filename = `${imageName}.${size}.jpg`;
  }
  return PRODUCT_IMAGE_URL(`${path}/${filename}`);
}
