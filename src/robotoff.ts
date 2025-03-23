import createClient from "openapi-fetch";

import { paths } from "./schemas/robotoff";
import { USER_AGENT } from "./consts";
import { formBody } from "./formbody";

type InsightQuery = paths["/insights"]["get"]["parameters"]["query"];
type InsightResponse =
  paths["/insights"]["get"]["responses"]["200"]["content"]["application/json"];
type AnnotateBody =
  paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"];

export type Question = {
  insight_id: string;
  question: string;
  image_url?: string;
  value?: string;
};

type QuestionsResponse = {
  status?: "found" | "no_questions";
  questions?: Question[];
};

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
    const stringifyValues = (body: AnnotateBody) => {
      return Object.fromEntries(
        Object.entries(body).map(([key, value]) => [key, String(value)]),
      );
    };
    return this.raw.POST("/insights/annotate", {
      body: body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      bodySerializer: (body) => formBody(stringifyValues(body)),
    });
  }

  async questionsByProductCode(code: number): Promise<QuestionsResponse> {
    const result = await this.raw.GET("/questions/{barcode}", {
      params: {
        path: { barcode: code },
      },
    });
    return result.data as QuestionsResponse;
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

  // TODO: replace any with proper type
  // ATM not specifying the type makes tsc fail sometimes
  async loadLogo(logoId: string): Promise<any> {
    // @ts-expect-error TODO: still not documented
    const result = await this.raw.GET("/images/logos/{logoId}", {
      params: { path: { logoId } },
    });
    return result.data;
  }
}
