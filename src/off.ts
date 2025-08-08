import createClient from "openapi-fetch";
import {
  PRODUCT_IMAGE_URL,
  USER_AGENT,
  BackendType,
  BACKEND_DOMAINS,
  BACKEND_NAMES,
} from "./consts";
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

export type ProductV2 = componentsv2["schemas"]["Product"];
export type ProductV3 = componentsv3["schemas"]["product_v3"];
export type ResponseStatusV3 = componentsv3["schemas"]["response_status"];
export type SearchResultV2 = componentsv2["schemas"]["search_for_products"];

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
  private readonly defaultOptions: {
    lang?: string;
    country?: string;
    username?: string;
    password?: string;
  };

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
    this.defaultOptions = {
      lang: options.country,
      country: options.country,
      username: undefined,
      password: undefined,
    };

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

  async search(query: operationsv2["get-search"]["parameters"]["query"]) {
    const res = await this.rawV2.GET("/api/v2/search", {
      params: { query },
    });

    return res.data;
  }

  /**
   * Returns all available attribute groups
   * @returns A promise that resolves to an array of attribute groups
   */
  async getAttributeGroups(): Promise<
    componentsv2["schemas"]["get_attribute_groups"]
  > {
    const res = await this.rawV2.GET("/api/v2/attribute_groups");

    return res.data || [];
  }

  /**
   * Returns product attributes for a given barcode
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to an array of product attributes
   */
  async getProductAttributes(barcode: string): Promise<ProductAttribute[]> {
    const res = await this.rawV2.GET("/api/v2/product/{barcode}", {
      params: {
        path: { barcode },
        query: { fields: "product_name,code,attribute_groups_en" },
      },
    });

    // @ts-expect-error - OpenAPI schema may not include all possible fields
    return res.data?.product?.attribute_groups_en || [];
  }

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

  /**
   * Adds or edits a product using the V2 API
   * @param product - The product data to add or edit
   * @param credentials - Optional credentials for authentication
   * @returns A promise that resolves to true if successful, false otherwise
   */
  async addOrEditProductV2(
    product: ProductDataType & { comment?: string },
    credentials?: { username: string; password: string },
  ): Promise<boolean> {
    const url = `${this.baseUrl}/cgi/product_jqm2.pl`;

    const username = credentials?.username || this.defaultOptions.username;
    const password = credentials?.password || this.defaultOptions.password;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    const languageCodes = Object.keys(product.languages_codes || {});
    const productNames = languageCodes.reduce(
      (acc, lang) => {
        const productName = this.getProductNameInLang(product, lang);
        if (productName != null) {
          acc[`product_name_${lang}`] = productName;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const ingredientsTexts = languageCodes.reduce(
      (acc, lang) => {
        const ingredientsText = this.getProductIngredientsInLang(product, lang);
        if (ingredientsText != null) {
          acc[`ingredients_text_${lang}`] = ingredientsText;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const body = this.formData({
      code: product.code,
      user_id: username,
      password: password,
      categories: product.categories || "",
      labels: product.labels || "",
      brands: product.brands || "",
      quantity: product.quantity || "",
      serving_size: product.serving_size || "",
      stores: product.stores || "",
      origins: product.origins || "",
      countries: product.countries || "",
      emb_codes: product.emb_codes || "",
      packaging: product.packaging || "",
      manufacturing_places: product.manufacturing_places || "",
      comment: product.comment ?? "",
      product_name: product.product_name || "",
      ingredients_text: product.ingredients_text || "",
      ...productNames,
      ...ingredientsTexts,
    });

    const res = await this.fetch(url, {
      method: "POST",
      body,
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    return res.status === 200;
  }

  /**
   * Uploads an image to OpenFoodFacts for a product.
   * @param barcode - The barcode of the product
   * @param imageFile - The image file to upload
   * @param imagefield - The field name for the image (e.g., "front", "ingredients", "nutrition")
   * @returns A promise that resolves to the upload response
   */
  async uploadImage(
    barcode: string,
    imageFile: File,
    imagefield: string,
  ): Promise<componentsv2["schemas"]["add_photo_to_existing_product-2"]> {
    const url = `${this.baseUrl}/cgi/product_image_upload.pl`;
    const formData = new FormData();
    formData.append("code", barcode);
    formData.append("imagefield", imagefield);
    formData.append(`imgupload_${imagefield}`, imageFile);

    const res = await this.fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "User-Agent": USER_AGENT,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to upload image for product with barcode: ${barcode}. Status: ${res.status}`,
      );
    }

    return res.json();
  }

  /**
   * Crops and selects an image for a product
   * @param barcode - The barcode of the product
   * @param imgid - Identifier of the image to select (should be a number)
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param cropData - Crop coordinates and options
   * @returns A promise that resolves to the crop response
   */
  async cropImage(
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
  ): Promise<Record<string, never>> {
    const res = await this.rawV2.POST("/cgi/product_image_crop.pl", {
      body: {
        code: barcode,
        imgid: imgid,
        id: id,
        x1: cropData.x1,
        y1: cropData.y1,
        x2: cropData.x2,
        y2: cropData.y2,
        angle: cropData.angle,
        normalize: cropData.normalize ? "true" : "false",
        white_magic: cropData.white_magic ? "true" : "false",
        comment: cropData.comment,
        app_name: cropData.app_name,
        app_version: cropData.app_version,
        app_uuid: cropData.app_uuid,
        "User-Agent": cropData.user_agent,
      },
    });

    return res.data || {};
  }

  /**
   * Rotates an image for a product
   * @param barcode - The barcode of the product
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param imgid - Identifier of the image to rotate (should be a number as string)
   * @param angle - Angle of rotation in degrees (90, 180, or 270 clockwise)
   * @returns A promise that resolves to the rotation response
   */
  async rotateImage(
    barcode: string,
    id: string,
    imgid: string,
    angle: string,
  ): Promise<componentsv2["schemas"]["rotate_a_photo"]> {
    const res = await this.rawV2.GET("/cgi/product_image_crop.pl", {
      params: {
        query: {
          code: barcode,
          id: id,
          imgid: imgid,
          angle: angle,
        },
      },
    });

    return res.data || {};
  }

  /**
   * Unselects an image for a product
   * @param barcode - The barcode of the product
   * @param id - Image field (image id) of the photo to unselect (e.g., "front_fr")
   * @returns A promise that resolves to the unselect response
   */
  async unselectImage(
    barcode: string,
    id: string,
  ): Promise<
    operationsv2["post-cgi-product_image_unselect.pl"]["responses"][200]["content"]["application/json"]
  > {
    const res = await this.rawV2.POST("/cgi/product_image_unselect.pl", {
      body: {
        code: barcode,
        id: id,
      },
    });

    return res.data || {};
  }

  /**
   * Deletes an uploaded image for a product
   * @param barcode - The barcode of the product corresponding to the image
   * @param imgid - The id of the image to be deleted
   * @returns A promise that resolves to the deletion response
   */
  async deleteProductImage(
    barcode: string,
    imgid: number,
  ): Promise<componentsv3["schemas"]["response_status"]> {
    const res = await this.rawV3.DELETE(
      "/api/v3/product/{barcode}/images/uploaded/{imgid}",
      {
        params: {
          path: { barcode, imgid },
        },
      },
    );

    return res.data || {};
  }

  /**
   * Returns reduced product data suitable for displaying on cards
   * @param barcode - The barcode of the product
   * @param lang - Optional language code for localization
   * @returns A promise that resolves to reduced product data
   */
  async getProductReducedForCard(
    barcode: string,
    lang?: string,
  ): Promise<ProductState<ProductReduced>> {
    const query: Record<string, string> = {
      fields: REDUCED_FIELDS.join(","),
    };

    const selectedLang = lang || this.defaultOptions.lang;
    if (selectedLang) {
      query.lc = selectedLang;
    }

    const res = await this.rawV3.GET("/api/v3/product/{barcode}", {
      params: {
        path: { barcode },
        query,
      },
    });

    return res.data as ProductState<ProductReduced>;
  }

  /**
   * Returns only the product name for a given barcode
   * @param barcode - The barcode of the product
   * @param lang - Optional language code for localization
   * @returns A promise that resolves to the product name or null if not found
   */
  async getProductName(
    barcode: string,
    lang?: string,
  ): Promise<Pick<ProductDataType, "product_name"> | null> {
    const query: Record<string, string> = {
      fields: "product_name",
    };

    const selectedLang = lang || this.defaultOptions.lang;
    if (selectedLang) {
      query.lc = selectedLang;
    }

    const res = await this.rawV3.GET("/api/v3/product/{barcode}", {
      params: {
        path: { barcode },
        query,
      },
    });

    const productState = res.data as ProductState<
      Pick<ProductDataType, "product_name">
    >;

    if (productState?.status !== "success") return null;
    return productState.product;
  }

  /**
   * Returns product data using the V2 API
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to the product data or undefined if not found
   */
  async getProductV2(barcode: string): Promise<ProductV2 | undefined> {
    const res = await this.rawV2.GET("/api/v2/product/{barcode}", {
      params: { path: { barcode } },
    });

    return res.data?.product;
  }

  /**
   * Returns an array of image names for the product
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to an array of image names or null if not found
   */
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

  private getProductNameInLang(product: ProductDataType, lang: string) {
    return product[`product_name_${lang}`] ?? product.product_name;
  }

  private getProductIngredientsInLang(product: ProductDataType, lang: string) {
    return product[`ingredients_text_${lang}`] ?? product.ingredients_text;
  }

  private formData(data: Record<string, string | Blob>) {
    const form = new FormData();
    for (const [key, value] of Object.entries(data)) {
      form.append(key, value);
    }
    return form;
  }

  /**
   * Gets URL for a product image based on its barcode and image name
   * @param barcode - Product barcode
   * @param imageName - Name of the image (e.g., "front", "ingredients", "nutrition")
   * @param images - Image metadata from product data
   * @param size - Image size (100, 200, 400, or full) - defaults to 400
   * @returns Complete URL to the specific image or null if not found
   */
  static getProductImageUrl(
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
}

export type ProductStateBase = {
  result: {
    id: string;
    name: string;
    lc_name: string;
  };
};

export type ProductStateError = {
  field: { id: string; value: string };
  impact: { lc_name: string; name: string; id: string };
  message: { lc_name: string; name: string; id: string };
};

export type ProductStateFailure = ProductStateBase & {
  status: "failure";
  errors: ProductStateError[];
};

export type ProductStateFound<T = ProductDataType> = ProductStateBase & {
  product: T;
} & (
    | { status: "success" }
    | { status: "success_with_warnings"; warnings: object[] }
    | { status: "success_with_errors"; errors: ProductStateError[] }
  );

export type ProductState<T = ProductDataType> = ProductStateBase &
  (ProductStateFound<T> | ProductStateFailure);

export type ProductSearch<T = ProductDataType> = {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: T[];
  skip: number;
};

export type Attribute = {
  id: string;
  name: string;
  grade: string;
  title: string;
  description_short?: string;
  icon_url?: string;
};

export type ProductAttribute = {
  id: string;
  name: string;
  attributes: Attribute[];
};

export type ProductAttributes = ProductAttribute[];

type LangIngredient = `ingredients_text_${string}`;
type LangProduct = `product_name_${string}`;

type ImageSize = {
  h: number;
  w: number;
};

export type SelectedImage = {
  angle: number;
  coordinates_image_size: string;
  geometry: string;
  imgid: string;
  normalize: string | boolean | null;
  rev: string;
  sizes: {
    100: ImageSize;
    200: ImageSize;
    400: ImageSize;
    full: ImageSize;
  };
  white_magic: string | boolean | null;
  x1: string;
  x2: string;
  y1: string;
  y2: string;
};

export type RawImage = {
  url: string;
  sizes: {
    full: ImageSize;
    100: ImageSize;
    400: ImageSize;
  };
  uploaded_t: string;
  uploader: string;
};

export type ProductDataSection = {
  created_t: number;
  creator: string;
  last_modified_t: number;
  last_editor: string;
  editors_tags: string[];
  last_checked_t: number;
  checkers_tags: string[];
  states_hierarchy: string[];
};

export type ProductDataType = ProductDataSection & {
  knowledge_panels: Record<string, any>;
  product_name: string;
  [lang: LangProduct]: string;
  _id: string;
  code: string;
  _keywords: string[];
  additives_n: number;
  ingredients: {
    id: string;
    percent: number;
    percent_estimate: number;
    percent_max: number;
    percent_min: number;
    text: string;
    vegan: string;
    vegetarian: string;
  }[];
  additives_tags: string[];

  ingredients_text: string;
  [lang: LangIngredient]: string;

  image_front_url: string;
  image_front_small_url: string;

  image_ingredients_url: string;
  image_ingredients_small_url: string;
  image_ingredients_thumb_url: string;

  images: Record<string, SelectedImage | RawImage>;

  image_nutrition_url: string;
  image_nutrition_small_url: string;
  image_nutrition_thumb_url: string;

  quantity: string;
  serving_size: string;
  nutriscore_grade: string;
  ecoscore_grade: string;
  nova_group: number;

  packaging: string;
  manufacturing_places: string;

  brands: string;
  brands_tags: string[];

  categories: string;
  categories_tags: string[];
  categories_hierarchy: object[];

  stores: string;
  stores_tags: string[];

  labels: string;
  labels_tags: string[];
  product_type: string;

  origins: string;
  origins_tags: string[];

  countries: string;
  countries_tags: string[];

  emb_codes: string;
  emb_codes_tags: string[];

  nutriments: any;

  no_nutrition_data?: boolean;

  source: {
    fields: string[];
    id: string;
    images: object[];
    import_t: number;
    manufacturer: number | string;
    name: string;
    source_licence: string;
    source_licence_url: string;
    url?: string;
  };

  link: string;

  languages_codes: {
    [lang: string]: number;
  };
  lang: string;
};

const REDUCED_FIELDS = [
  "image_front_small_url",
  "code",
  "product_name",
  "brands",
  "quantity",
  "nutriscore_grade",
  "ecoscore_grade",
  "nova_group",
  "product_type",
] as const;

export type ProductReduced = Pick<
  ProductDataType,
  (typeof REDUCED_FIELDS)[number]
>;

// By default, use v2
export { ProductV2 as Product, SearchResultV2 as SearchResult };

export default OpenFoodFacts;
