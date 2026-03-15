import type { paths } from "./schemas/search.js";
import createClient from "openapi-fetch";
import { USER_AGENT } from "./consts.js";

/**
 * Base URL for the Open Food Facts search service.
 */
const SEARCH_BASE_URL = "https://search.openfoodfacts.org";

/**
 * Query parameters for fetching a document.
 */
export type DocumentQuery =
  paths["/document/{identifier}"]["get"]["parameters"]["query"];

/**
 * Query parameters for GET /search endpoint.
 */
export type SearchQuery = paths["/search"]["get"]["parameters"]["query"];

/**
 * Raw POST search body type from OpenAPI schema.
 */
type RawSearchBody =
  paths["/search"]["post"]["requestBody"]["content"]["application/json"];

/**
 * Temporary chart type definitions.
 * These exist because the OpenAPI spec currently does not
 * provide correct typing for the /search POST charts parameter.
 * Once the OpenAPI spec is fixed, these can be removed.
 */
type DistributionChartParam = {
  chart_type: "DistributionChart";
  field: string;
};

type ScatterChartParam = {
  chart_type: "ScatterChart";
  x: string;
  y: string;
};

/**
 * Search request body used by the SDK.
 * Overrides the charts typing from the raw OpenAPI spec.
 */
export type SearchBody = Omit<RawSearchBody, "charts"> & {
  charts?: (DistributionChartParam | ScatterChartParam)[];
};

/**
 * Query parameters for autocomplete endpoint.
 */
export type AutocompleteQuery =
  paths["/autocomplete"]["get"]["parameters"]["query"];

/**
 * Query parameters for HTML search endpoint.
 */
export type HtmlSearchQuery =
  paths["/off-test"]["get"]["parameters"]["query"];

/**
 * Search API client for interacting with the Open Food Facts search service.
 */
export class SearchApi {
  private readonly client: ReturnType<typeof createClient<paths>>;

  /**
   * Creates a new SearchApi instance.
   *
   * @param fetch - Fetch implementation (browser or Node.js)
   * @param options - Optional configuration for the client
   */
  constructor(
    fetch: typeof globalThis.fetch,
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

  /**
   * Fetch a document by its identifier.
   *
   * @param identifier - Document identifier
   * @param query - Optional query parameters
   */
  async getDocument(identifier: string, query?: DocumentQuery) {
    return this.client.GET("/document/{identifier}", {
      params: { path: { identifier }, query },
    });
  }

  /**
   * Perform a POST search request.
   * Supports advanced search parameters and chart options.
   *
   * @param body - Search request body
   */
  async search(body: SearchBody) {
    return this.client.POST("/search", {
      body: body as unknown as RawSearchBody,
    });
  }

  /**
   * Perform a GET search request.
   * Useful for simple query-based searches.
   *
   * @param query - Search query parameters
   */
  async searchGet(query: SearchQuery) {
    return this.client.GET("/search", { params: { query } });
  }

  /**
   * Get autocomplete suggestions for a search query.
   *
   * @param query - Autocomplete query parameters
   */
  async autocomplete(query: AutocompleteQuery) {
    return this.client.GET("/autocomplete", { params: { query } });
  }

  /**
   * Fetch the demo homepage of the search service.
   */
  async getOffDemo() {
    return this.client.GET("/", {});
  }

  /**
   * Perform an HTML-based search request.
   *
   * @param query - Optional HTML search query
   */
  async htmlSearch(query?: HtmlSearchQuery) {
    return this.client.GET("/off-test", { params: { query } });
  }

  /**
   * Fetch the robots.txt file from the search service.
   */
  async getRobotsTxt() {
    return this.client.GET("/robots.txt", {});
  }

  /**
   * Perform a health check on the search service.
   * Useful to verify that the API is operational.
   */
  async healthCheck() {
    return this.client.GET("/health", {});
  }
}