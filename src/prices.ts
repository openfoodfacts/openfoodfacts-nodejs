import createClient from "openapi-fetch";
import type { paths } from "$schemas/prices";

type PricesQuery = paths["/api/v1/prices"]["get"]["parameters"]["query"];
export type PricesCreate =
  paths["/api/v1/prices"]["post"]["requestBody"]["content"]["application/json"];
export type Prices =
  paths["/api/v1/prices"]["get"]["responses"]["200"]["content"]["application/json"];

const BASE_URL = "https://prices.openfoodfacts.org";

export class PricesApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: typeof window.fetch,
    options: { baseUrl: string } = { baseUrl: BASE_URL }
  ) {
    this.client = createClient({
      fetch,
      baseUrl: options.baseUrl,
      credentials: "include",
    });
  }

  getPrices(query: PricesQuery) {
    return this.client.GET("/api/v1/prices", { params: { query } });
  }
  createPrice(body: PricesCreate) {
    return this.client.POST("/api/v1/prices", { body });
  }
  login(body: { username: string; password: string }) {
    return this.client.POST("/api/v1/auth", {
      params: { query: { set_cookie: true } },
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
    const res = await this.getProofs();
    return res.error == null;
  }

  async getStatus() {
    const res = await this.client.GET("/api/v1/status");
    return res.data as { status: string };
  }
}
