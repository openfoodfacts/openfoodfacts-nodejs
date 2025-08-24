import createClient from "openapi-fetch";

import { paths } from "./schemas/robotoff";
import { DEFAULT_ROBOTOFF_API_URL, USER_AGENT } from "./consts";
import { formBody } from "./formbody";

export type RobotoffInsightQuery =
  paths["/insights"]["get"]["parameters"]["query"];
export type RobotoffInsightResponse =
  paths["/insights"]["get"]["responses"]["200"]["content"]["application/json"];
export type RobotoffAnnotateBody =
  paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"];

export type Question = {
  insight_id: string;
  question: string;
  image_url?: string;
  value?: string;
};

export type QuestionsResponse = {
  status?: "found" | "no_questions";
  questions?: Question[];
};

export class Robotoff {
  /** The fetch function used for every request */
  private readonly fetch: typeof global.fetch;

  /** The raw openapi-fetch client is used for every request exposed by the openapi schema */
  private readonly raw: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: typeof global.fetch,
    options: { baseUrl: string } = { baseUrl: DEFAULT_ROBOTOFF_API_URL },
  ) {
    this.fetch = fetch;
    this.raw = createClient<paths>({
      fetch: this.fetch,
      baseUrl: options.baseUrl,
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  }

  async annotate(body: RobotoffAnnotateBody) {
    const stringifyValues = (body: RobotoffAnnotateBody) => {
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
    const result = await this.raw.GET("/insights/detail/{insight_id}", {
      params: { path: { insight_id: id } },
    });
    return result.data;
  }

  /**
   * Fetches insights based on the provided query.
   *
   * @param {RobotoffInsightQuery} query - The query object containing parameters for fetching insights.
   * @returns {Promise<RobotoffInsightResponse | undefined>} A promise that resolves to the data from the insights endpoint
   *
   */
  async insights(
    query: RobotoffInsightQuery,
  ): Promise<RobotoffInsightResponse | undefined> {
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
