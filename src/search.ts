import type { paths } from "./schemas/search.js";
import openapiFetchCreateClient from "openapi-fetch";
import { unwrapCjsDefault } from "./interop-workaround.js";
import { USER_AGENT } from "./consts.js";
import type { FetchFn } from "./types.js";

// https://github.com/rolldown/tsdown/issues/1054
const createClient = unwrapCjsDefault(openapiFetchCreateClient);

const SEARCH_BASE_URL = "https://search.openfoodfacts.org";

export type DocumentQuery =
  paths["/document/{identifier}"]["get"]["parameters"]["query"];

export type SearchQuery = paths["/search"]["get"]["parameters"]["query"];
type RawSearchBody =
  paths["/search"]["post"]["requestBody"]["content"]["application/json"];

// TODO: These are defined because openapi does not have correct typing for
// the /search POST charts parameter.
// Once the OpenAPI spec is fixed, these types can be removed.
type DistributionChartParam = {
  chart_type: "DistributionChart";
  field: string;
};

type ScatterChartParam = {
  chart_type: "ScatterChart";
  x: string;
  y: string;
};

export type SearchBody = Omit<RawSearchBody, "charts"> & {
  charts?: (DistributionChartParam | ScatterChartParam)[];
};

export type AutocompleteQuery =
  paths["/autocomplete"]["get"]["parameters"]["query"];

export type HtmlSearchQuery = paths["/off-test"]["get"]["parameters"]["query"];

export class SearchApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: FetchFn,
    options: { baseUrl: string } = { baseUrl: SEARCH_BASE_URL },
  ) {
    this.client = createClient<paths>({
      fetch,
      baseUrl: options.baseUrl,
      credentials: "include",
      headers: {
        "User-Agent": USER_AGENT,
      },
    });
  }

  async getDocument(identifier: string, query?: DocumentQuery) {
    return this.client.GET("/document/{identifier}", {
      params: { path: { identifier }, query },
    });
  }

  async search(body: SearchBody) {
    return this.client.POST("/search", {
      body: body as unknown as RawSearchBody,
    });
  }

  async searchGet(query: SearchQuery) {
    return this.client.GET("/search", { params: { query } });
  }

  async autocomplete(query: AutocompleteQuery) {
    return this.client.GET("/autocomplete", { params: { query } });
  }

  async getOffDemo() {
    return this.client.GET("/", {});
  }

  async htmlSearch(query?: HtmlSearchQuery) {
    return this.client.GET("/off-test", { params: { query } });
  }

  async getRobotsTxt() {
    return this.client.GET("/robots.txt", {});
  }

  async healthCheck() {
    return this.client.GET("/health", {});
  }
}
