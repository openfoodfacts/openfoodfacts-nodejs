import createClient from "openapi-fetch";
import type { components, paths } from "./schemas/prices.js";
import { USER_AGENT } from "./consts.js";

/**
 * Query parameters for retrieving prices.
 */
type GetPricesQuery = paths["/api/v1/prices"]["get"]["parameters"]["query"];

/**
 * Request body used to create a price entry.
 */
export type PricesCreate = components["schemas"]["PriceCreate"];

/**
 * Full price object returned by the API.
 */
export type PriceFull = components["schemas"]["PriceFull"];

/**
 * Base URL for the Open Food Facts prices API.
 */
const BASE_URL = "https://prices.openfoodfacts.org";

/**
 * Client for interacting with the Open Food Facts Prices API.
 */
export class PricesApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  /**
   * Creates a new PricesApi instance.
   *
   * @param fetch - Fetch implementation (browser or Node.js)
   * @param options - Optional configuration including base URL and auth token
   */
  constructor(
    fetch: typeof globalThis.fetch,
    options: { baseUrl: string; authToken?: string } = { baseUrl: BASE_URL },
  ) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    };

    if (options.authToken) {
      headers.Authorization = `Bearer ${options.authToken}`;
    }

    this.client = createClient({
      fetch,
      baseUrl: options.baseUrl,
      credentials: "include",
      headers,
    });
  }

  /**
   * Fetch prices from the API.
   */
  getPrices(query: GetPricesQuery) {
    return this.client.GET("/api/v1/prices", { params: { query } });
  }

  /**
   * Create a new price entry.
   */
  createPrice(body: PricesCreate) {
    return this.client.POST("/api/v1/prices", { body });
  }

  /**
   * Login using username and password.
   *
   * NOTE:
   * The OpenAPI specification incorrectly defines this endpoint.
   * The `set_cookie` parameter is required but missing from the spec.
   */
  login(body: { username: string; password: string }) {
    return this.client.POST("/api/v1/auth", {
      // OpenAPI spec does not include this parameter
      params: { query: { set_cookie: 1 } },
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
     bodySerializer: (body: { username: string; password: string }) =>
  new URLSearchParams(body as Record<string, string>),
    });
  }

  /**
   * Upload a proof image (receipt or price proof).
   */
  uploadProof(body: { file: Blob }) {
    return this.client.POST("/api/v1/proofs/upload", {
      // FormData typing not supported by openapi-fetch
      body: body,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  /**
   * Retrieve uploaded proofs.
   */
  getProofs() {
    return this.client.GET("/api/v1/proofs");
  }

  /**
   * Check if the current user is authenticated.
   */
  async isAuthenticated(): Promise<boolean> {
    const res = await this.client.GET("/api/v1/session");
    return res.response.ok;
  }

  /**
   * Get API service status.
   */
  async getStatus(): Promise<{ status: string }> {
    const res = await this.client.GET("/api/v1/status");
    return res.data as { status: string };
  }

  /**
   * Fetch the OpenAPI schema.
   *
   * @param format - Response format (json or yaml)
   */
  private async getSchema(format?: "json" | "yaml") {
    const res = await this.client.GET("/api/schema", {
      params: { query: format ? { format } : {} },
    });

    return res;
  }

  /**
   * Retrieve the list of supported currencies.
   */
  async getCurrenciesList(): Promise<string[]> {
    const res = await this.getSchema("json");

    // OpenAPI types do not represent the dynamic schema structure
    // so we safely access the enum field.
    // ts-expect-error schema structure not fully typed
    return res?.data?.components?.schemas?.CurrencyEnum?.enum || [];
  }
}