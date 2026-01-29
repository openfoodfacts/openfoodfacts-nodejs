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
export type LogoSearchParams = {
  server_type?: "off" | "obf" | "opff" | "opf" | "off_pro";
  barcode?: string;
  count?: number;
  type?: string;
  value?: string;
  taxonomy_value?: string;
  min_confidence?: number;
  random?: boolean;
  annotated?: boolean | null;
};
export type LogoAnnotation = {
  logo_id: number;
  type:
    | "brand"
    | "category"
    | "label"
    | "no_logo"
    | "nutritional_label"
    | "packager_code"
    | "packaging"
    | "qr_code"
    | "store";
  value: string | null;
  server_type?: "off" | "obf" | "opff" | "opf" | "off_pro";
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
    const common = {
      params: {
        query: { index, count },
      },
    };
    if (logoId != null) {
      interface AnnSearchByIdParams {
        path: { logo_id: number };
        query: { index: number; count: number };
      }
      return this.raw.GET("/ann/search/{logo_id:int}", {
        ...common,
        params: {
          ...common.params,
          path: { logo_id: logoId },
        } as AnnSearchByIdParams,
      } as any);
    }

    return this.raw.GET("/ann/search", common);
  }
}
