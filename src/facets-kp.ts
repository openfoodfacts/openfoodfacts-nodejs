import createClient from "openapi-fetch";
import type { KnowledgePanel } from "./knowledgepanels.js";
import type { paths } from "./schemas/facets-kp.js";

export type FacetKnowledgePanelResponse = {
  knowledge_panels: Record<string, KnowledgePanel>;
};

/**
 * Facets Knowledge Panel API
 *
 * @param fetch - The fetch function to use for making requests.
 * @param baseUrl - The base URL for the API. If not provided, it defaults to "https://facets-kp.openfoodfacts.org".
 */
export class FacetsKp {
  readonly fetch: typeof window.fetch;
  readonly baseUrl: string;
  readonly client: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof window.fetch, { baseUrl }: { baseUrl?: string }) {
    this.fetch = fetch;
    this.baseUrl = baseUrl || "https://facets-kp.openfoodfacts.org";
    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: this.baseUrl,
    });
  }

  async getFacetKnowledgePanels(facet: string, value?: string) {
    return this.client.GET("/knowledge_panel", {
      params: { query: { facet_tag: facet, value_tag: value } },
    });
  }
}
