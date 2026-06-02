import createClient from "openapi-fetch";

import type { operations, paths } from "./schemas/robotoff.js";
import { DEFAULT_ROBOTOFF_API_URL, USER_AGENT } from "./consts.js";
import { formBody } from "./formbody.js";

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
export type LogoSearchParams =
  paths["/images/logos/search"]["get"]["parameters"]["query"];

export type LogoAnnotation =
  paths["/images/logos/annotate"]["post"]["requestBody"]["content"]["application/json"]["annotations"][number];

export class Robotoff {
  /** The fetch function used for every request */
  private readonly fetch: typeof global.fetch;

  /** The raw openapi-fetch client is used for every request exposed by the openapi schema */
  private readonly raw: ReturnType<typeof createClient<paths>>;

  /** The base URL for the API */
  private readonly baseUrl: string;

  constructor(
    fetch: typeof global.fetch,
    options: { baseUrl: string } = { baseUrl: DEFAULT_ROBOTOFF_API_URL },
  ) {
    this.fetch = fetch;
    this.baseUrl = new URL("/api/v1", options.baseUrl).toString();
    this.raw = createClient<paths>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  }

  async annotate(body: RobotoffAnnotateBody) {
    return this.raw.POST("/insights/annotate", {
      body: body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      bodySerializer: formBody,
    });
  }

  questionsByProductCode(
    code: number,
    query?: operations["getQuestionsByBarcode"]["parameters"]["query"],
  ) {
    return this.raw.GET("/questions/{barcode}", {
      params: { path: { barcode: code }, query: query },
    });
  }

  insightDetail(id: string) {
    return this.raw.GET("/insights/detail/{insight_id}", {
      params: { path: { insight_id: id } },
    });
  }

  /**
   * Fetches insights based on the provided query.
   *
   * @param {RobotoffInsightQuery} query - The query object containing parameters for fetching insights.
   * @returns A promise that resolves to the data from the insights endpoint
   *
   */
  insights(query: RobotoffInsightQuery) {
    return this.raw.GET("/insights", { params: { query } });
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

  searchLogos(params: LogoSearchParams) {
    return this.raw.GET("/images/logos/search", {
      params: { query: params },
    });
  }

  annotateLogos(annotations: LogoAnnotation[]) {
    return this.raw.POST("/images/logos/annotate", {
      body: { annotations },
    });
  }

  resetLogo(logoId: number) {
    return this.raw.POST("/images/logos/{logo_id}/reset", {
      params: { path: { logo_id: logoId } },
    });
  }

  getLogoAnnotations(logoId?: number, index = 0, count = 25) {
    const paginationParams = { query: { index, count } };

    if (logoId == null) {
      return this.raw.GET("/ann/search", { params: paginationParams });
    }

    return this.raw.GET("/ann/search/{logo_id}", {
      params: {
        ...paginationParams,
        path: { logo_id: logoId },
      },
    });
  }

  getCroppedImageUrl(
    imageUrl: string,
    /**
     * The bounding box of the crop, in the format [y_min, x_min, y_max, x_max]
     */
    boundingBox: [number, number, number, number],
  ) {
    const [y_min, x_min, y_max, x_max] = boundingBox;
    const params = new URLSearchParams({
      image_url: imageUrl,
      y_min: y_min.toString(),
      x_min: x_min.toString(),
      y_max: y_max.toString(),
      x_max: x_max.toString(),
    });
    return `${this.baseUrl}/images/crop?${params.toString()}`;
  }
}
