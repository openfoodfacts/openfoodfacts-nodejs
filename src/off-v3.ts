import createClient from "openapi-fetch";
import type { components, operations, paths } from "./schemas/server/v3.js";
import type { KnowledgePanel } from "./knowledgepanels.js";
import type {
  LangIngredient,
  LangProduct,
  RawImage,
  SelectedImage,
} from "./types.js";

export type ResponseStatus = components["schemas"]["response_status"];
export type Product = components["schemas"]["product_v3"];

export type ProductImageUploadParams = NonNullable<
  operations["post-api-v3-product-code-images"]["requestBody"]
>["content"]["application/json"];

export type ProductQuery = NonNullable<
  operations["get-api-v3-product-code"]["parameters"]["query"]
>;

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
  knowledge_panels: Record<string, KnowledgePanel>;
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

export type ProductStateBase = {
  result: {
    id: string;
    name: string;
    lc_name: string;
  };
};

export type ProductStateError = {
  field?: { id?: string; value?: string };
  impact?: { lc_name?: string; name?: string; id?: string };
  message?: { lc_name?: string; name?: string; id?: string };
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

export class ProductOpenerApiV3 {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  readonly client: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch, options: { host: string }) {
    this.fetch = fetch;
    this.baseUrl = options.host;
    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });
  }

  async uploadProductImage(code: string, params: ProductImageUploadParams) {
    return this.client.POST("/api/v3/product/{code}/images", {
      params: { path: { code } },
      body: { ...params },
    });
  }

  /**
   * Deletes an uploaded image for a product
   * @param barcode - The barcode of the product corresponding to the image
   * @param imgid - The id of the image to be deleted
   * @returns A promise that resolves to the deletion response
   */
  async deleteProductImage(code: string, imgid: number) {
    return await this.client.DELETE(
      "/api/v3/product/{code}/images/uploaded/{imgid}",
      { params: { path: { code, imgid } } },
    );
  }

  /**
   * Returns product details by barcode with optional fields
   * @param code - The barcode of the product
   * @param query - An optional query object to filter the returned fields
   * @template Keys - An array of keys from ProductV3 to return
   * @example
   * ```typescript
   * const result = await api.getProductV3("1234567890123", { fields: ["product_name", "brands"] });
   * console.log(result.product.product_name, result.product.brands);
   * ```
   * @returns A promise that resolves to a product object with the specified fields or undefined if not found
   */
  async getProductV3<
    Keys extends Array<Extract<keyof Product, string> | "all">,
  >(code: string, query?: Omit<ProductQuery, "fields"> & { fields?: Keys }) {
    const { error, data } = await this.client.GET("/api/v3/product/{code}", {
      params: {
        path: { code },
        query: { ...query, fields: query?.fields?.join(",") },
      },
    });

    if (error != null) {
      return { error, data: undefined };
    }

    type ProductStateType<T extends Array<string>> = "all" extends T[number]
      ? Product & Pick<Product, Extract<T[number], keyof Product>>
      : Pick<Product, Extract<T[number], keyof Product>>;

    return {
      data: data as ProductState<ProductStateType<Keys>>,
      error: undefined,
    };
  }
}
