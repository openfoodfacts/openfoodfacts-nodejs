import { paths, components } from "../schemas/server/docs/api/ref/api";
import createClient from "openapi-fetch";
import { Product, SearchResult } from "../types";
import { Robotoff } from "./robotoff";
import { RequestInfo, Response } from "node-fetch";
import { getTaxo } from "./taxonomy/api";
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

type OffOptions = {
  country: string;
};

export * from "./taxonomy/types";

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly fetch: (
    url: URL | RequestInfo,
    init?: RequestInit
  ) => Promise<Response>;

  private readonly client: ReturnType<typeof createClient<paths>>;
  readonly robotoff: Robotoff;
  readonly baseUrl: string;

  /**
   * Create OFF object
   * @param options - Options for the OFF Object
   */
  constructor(
    fetch: (url: URL | RequestInfo, init?: RequestInit) => Promise<Response>,

    options: OffOptions = {
      country: "world",
    }
  ) {
    this.baseUrl = `https://${options.country}.openfoodfacts.org`;
    this.fetch = fetch;

    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });

    this.robotoff = new Robotoff(fetch);
  }

  /**
   * @deprecated
   */
  country(country: string): OpenFoodFacts {
    return new OpenFoodFacts(fetch, { country });
  }

  private async getTaxoEntry<T extends TaxoNode>(
    taxo: string,
    entry: string
  ): Promise<T> {
    const res = await fetch(
      `${this.baseUrl}/api/v2/taxonomy?tagtype=${taxo}&tags=${entry}`
    );

    return (await res.json()) as T;
  }

  getBrands(): Promise<Taxonomy<Brand>> {
    return getTaxo("brands", this.fetch);
  }

  getBrand(brandName: string): Promise<Object> {
    return this.getTaxoEntry("brands", brandName);
  }

  getLanguages(): Promise<Taxonomy<Language>> {
    return getTaxo("languages", this.fetch);
  }

  getLanguage(languageName: string): Promise<Language> {
    return this.getTaxoEntry("languages", languageName);
  }

  getLabels(): Promise<Taxonomy<Label>> {
    return getTaxo("labels", this.fetch);
  }

  getAdditives(): Promise<Taxonomy<Additive>> {
    return getTaxo("additives", this.fetch);
  }

  getAllergens(): Promise<Taxonomy<Allergen>> {
    return getTaxo("allergens", this.fetch);
  }

  getCategories(): Promise<Taxonomy<Category>> {
    return getTaxo("categories", this.fetch);
  }

  getCountries(): Promise<Taxonomy<Country>> {
    return getTaxo("countries", this.fetch);
  }

  async getIngredients(): Promise<Taxonomy<Ingredient>> {
    return getTaxo("ingredients", this.fetch);
  }

  async getPackagings(): Promise<Taxonomy<Ingredient>> {
    return getTaxo("packaging", this.fetch);
  }

  async getStates(): Promise<Taxonomy<State>> {
    return getTaxo("states", this.fetch);
  }

  getStores(): Promise<Taxonomy<Store>> {
    return getTaxo("stores", this.fetch);
  }

  /**
   * It is used to get a specific product using barcode
   * @param barcode Barcode of the product you want to fetch details
   */
  async getProduct(barcode: string): Promise<Product | undefined> {
    const res = await this.client.get("/api/v2/product/{barcode}", {
      params: { path: { barcode } },
    });

    return res.data?.product;
  }

  async performOCR(
    barcode: string,
    photoId: string,
    ocrEngine: "google_cloud_vision" = "google_cloud_vision"
  ): Promise<{ status?: number | undefined } | undefined> {
    const res = await this.client.get("/cgi/ingredients.pl", {
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

  async getProductImages(barcode: string): Promise<string[]> {
    const res = await this.client.get(
      "/api/v2/product/{barcode}?fields=images",
      { params: { path: { barcode } } }
    );

    if (!res.data?.product) {
      throw new Error("Product not found");
    } else if (!res.data?.product?.images) {
      throw new Error("Images not found");
    }

    const imgObj = res.data?.product?.images;
    return Object.keys(imgObj);
  }

  async search(
    fields: string,
    sort_by: components["parameters"]["sort_by"]
  ): Promise<SearchResult | undefined> {
    const res = await this.client.get("/api/v2/search", {
      params: { query: { fields, sort_by } },
    });

    return res.data;
  }

  /**
   * It is used to get all products beginning with the given barcode string
   * @param {string} beginning - Barcode string from which if the barcode begins, then product is to be fetched
   * @return {Object} It returns a JSON of all products that begin with the given barcode string
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getProductsByBarcodeBeginning('3596710').then(products => {
   *   // use products
   * })
   */
  async getProductsByBarcodeBeginning(beginning: string) {
    const fill = "x".repeat(13 - beginning.length);
    const barcode = beginning.concat(fill);
    return this.getProduct(barcode);
  }
}
export default OpenFoodFacts;
