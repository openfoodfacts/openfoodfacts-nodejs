import createClient from "openapi-fetch";

import { paths } from "./schemas/robotoff";
import { USER_AGENT } from "./consts";

type InsightQuery = paths["/insights"]["get"]["parameters"]["query"];
type InsightResponse =
  paths["/insights"]["get"]["responses"]["200"]["content"]["application/json"];
type AnnotateBody =
  paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"];

export class Robotoff {
  /** The fetch function used for every request */
  private readonly fetch: typeof global.fetch;

  /** The raw openapi-fetch client is used for every request exposed by the openapi schema */
  private readonly raw: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch) {
    this.fetch = fetch;
    this.raw = createClient<paths>({
      fetch: this.fetch,
      baseUrl: "https://robotoff.openfoodfacts.org/api/v1",
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  }

  async annotate(body: AnnotateBody) {
    return this.raw.POST("/insights/annotate", {
      body: body,
    });
  }

  async questionsByProductCode(code: number) {
    const result = await this.raw.GET("/questions/{barcode}", {
      params: {
        path: { barcode: code },
      },
    });
    return result.data;
  }

  async insightDetail(id: string) {
    const result = await this.raw.GET("/insights/detail/{id}", {
      params: { path: { id } },
    });
    return result.data;
  }

  /**
   * Fetches insights based on the provided query.
   *
   * @param {InsightQuery} query - The query object containing parameters for fetching insights.
   * @returns {Promise<InsightResponse | undefined>} A promise that resolves to the data from the insights endpoint
   *
   */
  async insights(query: InsightQuery): Promise<InsightResponse | undefined> {
    const result = await this.raw.GET("/insights", { params: { query } });
    return result.data;
  }

  async loadLogo(logoId: string) {
    // @ts-expect-error TODO: still not documented
    const result = await this.raw.GET("/images/logos/{logoId}", {
      params: { path: { logoId } },
    });
    return result.data;
  }
}
