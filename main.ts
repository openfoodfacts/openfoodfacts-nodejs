import axios, { Axios } from "axios";
import { paths, components } from "./schemas/server/docs/api/ref/api";
import createClient from "openapi-fetch";
import { Product, SearchResult } from "./types";

type OffOptions = {
  country: string;
};

/** Wrapper of OFF API */
export class OpenFoodFacts {
  private readonly axios: Axios;
  private readonly client: ReturnType<typeof createClient<paths>>;

  /**
   * Create OFF object
   * @param options - Options for the OFF Object
   */
  constructor(options: OffOptions = {
    country: "world",
  }) {
    const baseUrl = `https://${options.country}.openfoodfacts.org`
    this.axios = axios.create({
      baseURL: baseUrl,
    });
    this.client = createClient<paths>({
      baseUrl: baseUrl,
      headers: {
        "User-Agent":
          "OpenFoodFacts NodeJS Client v" + require("../package.json").version,
      },
    });
  }

  /**
   * @deprecated
   */
  country(country: string): OpenFoodFacts {
    return new OpenFoodFacts({ country });
  }

  /**
   * It is used to get all brands.
   * @return {Object} It returns a JSON containing all brands
   * @example
   * const worldOFF = new OFF()
   * const indiaOFF = worldOFF.country('in')
   * indiaOFF.getBrands().then(brands => {
   *   // use brands
   * })
   */
  async getBrands(): Promise<object[]> {
    return this.axios.get(`/brands.json`).then((res) => res.data);
  }

  /**
   * It is used to get a specific product using barcode
   * @param {string} barcode - Barcode of the product you want to fetch details
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getProduct(7622210288257).then(product => {
   *   // use product
   * })
   */
  async getProduct(barcode: string): Promise<Product | undefined> {
    const res = await this.client.get("/api/v2/product/{barcode}", {
      params: { path: { barcode } },
    });

    return res.data?.product;
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
   * It is used to get all details of a specific brand
   * @param {string} brandName - Brand name of the brand you want to fetch details
   * @return {Object} It returns a JSON with all details of the brand
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getBrand('monoprix').then(brand => {
   *   // use brand
   * })
   */
  async getBrand(brandName: string): Promise<Object> {
    const res = await this.axios.get(`/brand/${brandName}.json`);
    return res.data;
  }

  /**
   * It is used to get all languages on the labels
   * @return {Object} It returns a JSON with list of all languages
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getLanguages().then(languages => {
   *   // use languages
   * })
   */
  async getLanguages(): Promise<object> {
    const res = await this.axios.get(`/languages.json`);
    return res.data;
  }

  /**
   * It is used to get all Labels from the API
   * @return {Object} It returns a JSON with all labels present on the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getLabels().then(labels => {
   *   // use labels
   * })
   */
  async getLabels(): Promise<object> {
    const res = await this.axios.get(`/labels.json`);
    return res.data;
  }

  /**
   * It is used to get all additives from the API
   * @return {Object} It returns a JSON with all additives present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getAdditives().then(additives =>{
   *    //use additives
   * })
   */
  async getAdditives(): Promise<object> {
    const res = await this.axios.get(`/additives.json`);
    return res.data;
  }

  /**
   * It is used to get all allergens from the API
   * @return {Object} It returns a JSON with all allergens present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getAllergens().then(allergens =>{
   *    //use allergens
   * })
   */
  async getAllergens(): Promise<object> {
    const res = await this.axios.get(`/allergens.json`);
    return res.data;
  }

  /**
   * It is used to get all categories from the API
   * @return {Object} It returns a JSON with all categories present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getCategories().then(categories =>{
   *    //use categories
   * })
   */
  async getCategories(): Promise<object> {
    const res = await this.axios.get(`/categories.json`);
    return res.data;
  }

  /**
   * It is used to get all countries from the API
   * @return {Object} It returns a JSON with all categories present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getCountries().then(countries =>{
   *    //use countries
   * })
   */
  async getCountries(): Promise<object> {
    const res = await this.axios.get(`/countries.json`);
    return res.data;
  }

  /**
   * It is used to get all entry dates from the API
   * @return {Object} It returns a JSON with all entry dates present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getEntryDates().then(entry_dates =>{
   *    //use entry_dates
   * })
   */
  async getEntryDates() {
    const res = await this.axios.get(`/entry-dates.json`);
    return res.data;
  }

  /**
   * It is used to get all ingredients from the API
   * @return {Object} It returns a JSON with all ingredients present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getIngredients().then(ingredients =>{
   *    //use ingredients
   * })
   */
  async getIngredients(): Promise<object> {
    const res = await this.axios.get(`/ingredients.json`);
    return res.data;
  }

  /**
   * It is used to get all packagings from the API
   * @return {Object} It returns a JSON with all packagings present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getPackagings().then(packagings =>{
   *    //use packagings
   * })
   */
  async getPackagings(): Promise<object> {
    const res = await this.axios.get(`/packaging.json`);
    return res.data;
  }

  /**
   * It is used to get packaging codes from the API
   * @return {Object} It returns a JSON with all packaging codes present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getPackagingCodes().then(packaging_codes =>{
   *    //use packaging_codes
   * })
   */
  async getPacakgingCodes() {
    const res = await this.axios.get(`/packager-codes.json`);
    return res.data;
  }

  /**
   * It is used to get all purchase places from the API
   * @return {Object} It returns a JSON with all purchase places present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getPurchasePlaces().then(purchase_places =>{
   *    //use purchase_places
   * })
   */
  async getPurchasePlaces(): Promise<object> {
    const res = await this.axios.get(`/purchase-places.json`);
    return res.data;
  }

  /**
   * It is used to get all states from the API
   * @return {Object} It returns a JSON with all states present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getStates().then(states =>{
   *    //use states
   * })
   */
  async getStates(): Promise<object> {
    const res = await this.axios.get(`/states.json`);
    return res.data;
  }

  /**
   * It is used to get all stores from the API
   * @return {Object} It returns a JSON with all stores present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getStores().then(stores =>{
   *    //use stores
   * })
   */
  async getStores(): Promise<object> {
    const res = await this.axios.get(`/stores.json`);
    return res.data;
  }

  /**
   * It is used to get all trace types from the API
   * @return {Object} It returns a JSON with all traces present in the API
   * @example
   * const worldOFF = new OFF()
   * worldOFF.getTraces().then(traces =>{
   *    //use traces
   * })
   */
  async getTraces(): Promise<object> {
    const res = await this.axios.get(`/traces.json`);
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