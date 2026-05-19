import createClient from "openapi-fetch";
import type { components, operations, paths } from "./schemas/server/v2.js";
import type { TaxoNode } from "./taxonomy/types.js";
import { formData } from "./openapi.js";
import { USER_AGENT } from "./consts.js";
import type { ProductDataType } from "./off-v3.js";
import type { FetchFn } from "./index.js";

export type SearchQuery = operations["get-search"]["parameters"]["query"];
export type AttributeGroups = components["schemas"]["get_attribute_groups"];
export type Product = components["schemas"]["Product"];
export type SearchResult = components["schemas"]["search_for_products"];

export type ProductAttribute = NonNullable<
  components["schemas"]["product_attribute_groups"]["attribute_groups"]
>[number];

export type ProductAttributeGroup = {
  id: string;
  name: string;
  warning?: string;
  attributes: ProductAttribute[];
};

/**
 * The OpenFoodFacts main API client for version 2.
 *
 * You should not use this class directly, instead use the `OpenFoodFactsApi` class.
 */
export class ProductOpenerApiV2 {
  private readonly fetch: FetchFn;
  private readonly baseUrl: string;
  readonly client: ReturnType<typeof createClient<paths>>;

  constructor(fetch: FetchFn, options: { host: string }) {
    this.fetch = fetch;
    this.baseUrl = options.host;
    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Get a taxonomy entry by its type and ID.
   * @param taxo - The type of taxonomy (e.g., "categories", "brands").
   * @param entry - The ID of the taxonomy entry.
   */
  async getTaxoEntry<T extends TaxoNode>(
    taxo: string,
    entry: string,
  ): Promise<T> {
    const res = await this.fetch(
      `${this.baseUrl}/api/v2/taxonomy?tagtype=${taxo}&tags=${entry}`,
    );

    return (await res.json()) as T;
  }

  /**
   * Performs OCR on a product image.
   * @example const {data, error} = await performOCR(barcode, photoId, ocrEngine);
   */
  async performOCR(
    barcode: string,
    photoId: string,
    ocrEngine: "google_cloud_vision" = "google_cloud_vision",
  ) {
    return this.client.GET("/cgi/ingredients.pl", {
      params: {
        query: {
          code: barcode,
          id: photoId,
          ocr_engine: ocrEngine,
          process_image: "1",
        },
      },
    });
  }

  /**
   * @example const {data, error} = await search(query);
   */
  async search(query: SearchQuery) {
    return this.client.GET("/api/v2/search", {
      params: { query },
    });
  }

  /**
   * Returns all available attribute groups
   * @returns A promise that resolves to an array of attribute groups
   * @example
   * const {data, error} = await getAttributeGroups();
   */
  async getAttributeGroups() {
    return this.client.GET("/api/v2/attribute_groups");
  }

  /**
   * Unselects an image for a product
   * @param barcode - The barcode of the product
   * @param id - Image field (image id) of the photo to unselect (e.g., "front_fr")
   * @returns A promise that resolves to the unselect response
   */
  async unselectImage(barcode: string, id: string) {
    return this.client.POST("/cgi/product_image_unselect.pl", {
      body: { code: barcode, id: id },
    });
  }

  /**
   * Returns product attributes for a given barcode
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to an array of product attributes
   */
  async getProductAttributes(code: string): Promise<ProductAttributeGroup[]> {
    const res = await this.client.GET("/api/v2/product/{code}", {
      params: {
        path: { code },
        query: { fields: "product_name,code,attribute_groups_en" },
      },
    });

    // @ts-expect-error - OpenAPI schema may not include all possible fields
    return res.data?.product?.attribute_groups_en || [];
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

    const languageCodes = Object.keys(product.languages_codes || {});
    const productNames = languageCodes.reduce(
      (acc, lang) => {
        const productName = getProductNameInLang(product, lang);
        if (productName != null) {
          acc[`product_name_${lang}`] = productName;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const ingredientsTexts = languageCodes.reduce(
      (acc, lang) => {
        const ingredientsText = getProductIngredientsInLang(product, lang);
        if (ingredientsText != null) {
          acc[`ingredients_text_${lang}`] = ingredientsText;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const body = formData({
      code: product.code,
      user_id: credentials?.username,
      password: credentials?.password,
      categories: product.categories || "",
      labels: product.labels || "",
      brands: product.brands || "",
      quantity: product.quantity || "",
      serving_size:
        product.no_nutrition_data === true ? "" : product.serving_size || "",
      stores: product.stores || "",
      origins: product.origins || "",
      countries: product.countries || "",
      emb_codes: product.emb_codes || "",
      packaging: product.packaging || "",
      manufacturing_places: product.manufacturing_places || "",
      comment: product.comment ?? "",
      product_name: product.product_name || "",
      ingredients_text: product.ingredients_text || "",
      no_nutrition_data: product.no_nutrition_data === true ? "on" : "",
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
   * Crops and selects an image for a product
   * @param barcode - The barcode of the product
   * @param imgid - Identifier of the image to select (should be a number)
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param cropData - Crop coordinates and options
   * @returns A promise that resolves to the crop response
   *
   * @example
   * const {data, error} = await cropImage(barcode, imgid, id, cropData);
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
  ) {
    return this.client.POST("/cgi/product_image_crop.pl", {
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
  }

  /**
   * Uploads an image to OpenFoodFacts for a product.
   * @param barcode - The barcode of the product
   * @param imageFile - The image file to upload
   * @param imagefield - The field name for the image (e.g., "front", "ingredients", "nutrition")
   * @returns A promise that resolves to the upload response
   */
  async uploadImage(barcode: string, imageFile: File, imagefield: string) {
    return this.client.POST("/cgi/product_image_upload.pl", {
      // @ts-expect-error - OpenAPI schema wrong
      body: {
        code: barcode,
        imagefield: imagefield,
        [`imgupload_${imagefield}`]: imageFile,
        "User-Agent": USER_AGENT,
      },
      bodySerializer: formData,
    });
  }

  /**
   * Rotates an image for a product
   * @param barcode - The barcode of the product
   * @param id - Identifier of the selected image field (format: {IMAGE_TYPE}_{LANG})
   * @param imgid - Identifier of the image to rotate (should be a number as string)
   * @param angle - Angle of rotation in degrees (90, 180, or 270 clockwise)
   * @returns A promise that resolves to the rotation response
   */
  async rotateImage(barcode: string, id: string, imgid: string, angle: string) {
    return await this.client.GET("/cgi/product_image_crop.pl", {
      params: {
        query: {
          code: barcode,
          id: id,
          imgid: imgid,
          angle: angle,
        },
      },
    });
  }

  /**
   * Returns product data using the V2 API
   * @param barcode - The barcode of the product
   * @returns A promise that resolves to the product data or undefined if not found
   * @example
   * const {data, error} = await getProductV2(barcode);
   */
  async getProductV2(code: string) {
    return this.client.GET("/api/v2/product/{code}", {
      params: { path: { code } },
    });
  }

  /**
   * Returns an array of image names for the product
   * @param code - The barcode of the product
   * @returns A promise that resolves to an array of image names or null if not found
   */
  async getProductImages(code: string): Promise<string[] | null> {
    const res = await this.client.GET("/api/v2/product/{code}", {
      params: {
        query: { fields: "images" },
        path: { code },
      },
    });

    const product = res.data?.product;

    // Check if the returned type has images
    if (!product) return null;
    if (!("images" in product)) return null;

    const images = product.images ?? {};
    return Object.keys(images);
  }

  /**
   * Updates the barcode of a product (moderator-only action)
   * @param currentCode - The current barcode of the product
   * @param newCode - The correct barcode to replace the current one
   * @returns A promise that resolves to true if successful, false otherwise
   * @example
   * const success = await changeBarcode("12345", "54321");
   */
  async changeBarcode(
    currentCode: string,
    newCode: string,
    credentials?: { username?: string; password?: string },
  ): Promise<boolean> {
    const res = await this.client.POST("/cgi/product_jqm2.pl", {
      // @ts-expect-error - OpenAPI schema requires user_id and password, but we want to omit them if undefined
      body: {
        code: currentCode,
        new_code: newCode,
        ...(credentials?.username ? { user_id: credentials.username } : {}),
        ...(credentials?.password ? { password: credentials.password } : {}),
      },
      bodySerializer: formData,
    });

    return res.response.ok;
  }
}

export function getProductNameInLang(product: ProductDataType, lang: string) {
  return product[`product_name_${lang}`] ?? product.product_name;
}

export function getProductIngredientsInLang(
  product: ProductDataType,
  lang: string,
) {
  return product[`ingredients_text_${lang}`] ?? product.ingredients_text;
}
