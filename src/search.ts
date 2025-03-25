import createClient from "openapi-fetch";
import type { paths } from "$schemas/search";
import { USER_AGENT } from "./consts";

const SEARCH_BASE_URL = "https://search.openfoodfacts.org";

type DocumentQuery =
  paths["/document/{identifier}"]["get"]["parameters"]["query"];

type SearchQuery = paths["/search"]["get"]["parameters"]["query"];
type SearchBody =
  paths["/search"]["post"]["requestBody"]["content"]["application/json"];

type AutocompleteQuery = paths["/autocomplete"]["get"]["parameters"]["query"];

type HtmlSearchQuery = paths["/off-test"]["get"]["parameters"]["query"];

export class SearchApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: typeof window.fetch,
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
    return this.client.POST("/search", { body });
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
