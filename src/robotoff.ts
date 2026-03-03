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

/**
 * Represents a logo object returned by the Robotoff API
 * Contains detailed information about a product logo
 */
export type LogoDetails = {
  /** Unique identifier for the logo */
  id: number;
  /** Product barcode associated with the logo */
  barcode: string;
  /** Type/category of the logo */
  type: string;
  /** ISO 8601 timestamp when the logo was created */
  created_at: string;
  /** ISO 8601 timestamp when the logo was last updated */
  updated_at: string;
  /** Image identifier */
  image_id: string;
  /** Optional bounding box coordinates for the logo in the image */
  bounding_box?: {
    /** Left coordinate */
    x_min: number;
    /** Top coordinate */
    y_min: number;
    /** Right coordinate */
    x_max: number;
    /** Bottom coordinate */
    y_max: number;
  };
  /** Optional annotation value */
  annotation_value?: string;
  /** Optional annotation type */
  annotation_type?: string;
  /** Optional taxonomy value for the logo */
  taxonomy_value?: string;
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

  /**
   * Loads detailed information for a specific logo by ID
   *
   * @param logoId - The ID of the logo to load
   * @returns A promise that resolves to the logo details, or undefined if not found
   *
   * @example
   * ```typescript
   * const logo = await robotoff.loadLogo("123");
   * if (logo) {
   *   console.log(`Logo ${logo.id} for product ${logo.barcode}`);
   * }
   * ```
   */
  async loadLogo(logoId: string): Promise<LogoDetails | undefined> {
    // @ts-expect-error Endpoint not yet documented in OpenAPI spec
    const result = await this.raw.GET("/images/logos/{logoId}", {
      params: { path: { logoId } },
    });
    return result.data as LogoDetails | undefined;
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
}
