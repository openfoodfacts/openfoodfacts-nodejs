import createClient from "openapi-fetch";
import { PRODUCT_API_HOST, PRODUCT_IMAGE_URL, USER_AGENT } from "./consts";
import {
  paths as pathsv2,
  components as componentsv2,
} from "./schemas/server/v2";
import {
  paths as pathsv3,
  operations as operationsv3,
  components as componentsv3,
} from "./schemas/server/v3";

export type ProductV2 = componentsv2["schemas"]["Product"];
export type ProductV3 = componentsv3["schemas"]["product_v3"];
export type ResponseStatusV3 = componentsv3["schemas"]["response_status"];

const BASE_URL = PRODUCT_API_HOST;

export class ProductsApi {
  private readonly fetch: typeof window.fetch;
  private readonly baseUrl: string;
  private readonly defaultOptions: {
    lang?: string;
    country?: string;
    username?: string;
    password?: string;
  };
  readonly rawV2: ReturnType<typeof createClient<pathsv2>>;
  readonly rawV3: ReturnType<typeof createClient<pathsv3>>;

  constructor(
    fetch: typeof window.fetch,
    options: {
      baseUrl?: string;
      lang?: string;
      country?: string;
      username?: string;
      password?: string;
    } = {},
  ) {
    this.fetch = fetch;
    this.baseUrl = options.baseUrl || BASE_URL;
    this.defaultOptions = {
      lang: options.lang,
      country: options.country,
      username: options.username,
      password: options.password,
    };
    this.rawV2 = createClient<pathsv2>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });
    this.rawV3 = createClient<pathsv3>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });
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
    product: Product & { comment?: string },
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
        const productName = ProductsApi.getProductNameInLang(product, lang);
        if (productName != null) {
          acc[`product_name_${lang}`] = productName;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const ingredientsTexts = languageCodes.reduce(
      (acc, lang) => {
        const ingredientsText = ProductsApi.getProductIngredientsInLang(
          product,
          lang,
        );
        if (ingredientsText != null) {
          acc[`ingredients_text_${lang}`] = ingredientsText;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const body = ProductsApi.formData({
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
  ): Promise<any> {
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
  ): Promise<Pick<Product, "product_name"> | null> {
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
      Pick<Product, "product_name">
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

  private static getProductNameInLang(product: Product, lang: string) {
    return product[`product_name_${lang}`] ?? product.product_name;
  }

  private static getProductIngredientsInLang(product: Product, lang: string) {
    return product[`ingredients_text_${lang}`] ?? product.ingredients_text;
  }

  private static formData(data: Record<string, string | Blob>) {
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

export type ProductStateFound<T = Product> = ProductStateBase & {
  product: T;
} & (
    | { status: "success" }
    | { status: "success_with_warnings"; warnings: object[] }
    | { status: "success_with_errors"; errors: ProductStateError[] }
  );

export type ProductState<T = Product> = ProductStateBase &
  (ProductStateFound<T> | ProductStateFailure);

export type ProductSearch<T = Product> = {
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

export type Product = ProductDataSection & {
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

export type ProductReduced = Pick<Product, (typeof REDUCED_FIELDS)[number]>;
