import createClient from "openapi-fetch";
import type { components, paths } from "./schemas/prices";
import { USER_AGENT } from "./consts";

type GetPricesQuery = paths["/api/v1/prices"]["get"]["parameters"]["query"];

export type PricesCreate = components["schemas"]["PriceCreate"];
export type PaginatedPriceFullList =
  components["schemas"]["PaginatedPriceFullList"];

const BASE_URL = "https://prices.openfoodfacts.org";

export class PricesApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: typeof window.fetch,
    options: { baseUrl: string; authToken?: string } = { baseUrl: BASE_URL },
  ) {
    this.client = createClient({
      fetch,
      baseUrl: options.baseUrl,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options?.authToken}`,
        "User-Agent": USER_AGENT,
      },
    });
  }

  getPrices(query: GetPricesQuery) {
    return this.client.GET("/api/v1/prices", { params: { query } });
  }
  createPrice(body: PricesCreate) {
    return this.client.POST("/api/v1/prices", { body });
  }
  login(body: { username: string; password: string }) {
    return this.client.POST("/api/v1/auth", {
      // @ts-expect-error - The type definition currently specify set_cookie as a boolean which is incorrect.
      // until that is fixed, we need to use this workaround.
      params: { query: { set_cookie: 1 } },
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      bodySerializer: (body) =>
        new URLSearchParams(body as Record<string, string>),
    });
  }

  uploadProof(body: { file: Blob }) {
    return this.client.POST("/api/v1/proofs/upload", {
      // @ts-expect-error - FormData is not supported by openapi-fetch
      body: body,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  getProofs() {
    return this.client.GET("/api/v1/proofs");
  }

  async isAuthenticated() {
    const res = await this.client.GET("/api/v1/session");
    return res.response.ok;
  }

  async getStatus() {
    const res = await this.client.GET("/api/v1/status");
    return res.data as { status: string };
  }

  private async getSchema(format?: "json" | "yaml") {
    const res = await this.client.GET("/api/schema", {
      params: { query: format ? { format } : {} },
    });
    return res;
  }

  async getCurrenciesList(): Promise<string[]> {
    const res = await this.getSchema("json");

    // @ts-expect-error - OpenAPI types do not reflect the dynamic structure of schema paths
    return res?.data?.components?.schemas?.CurrencyEnum?.enum || [];
  }
}
