import createClient from "openapi-fetch";

import { paths } from "./schemas/robotoff";

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
    });
  }

  async annotate(
    body: paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"]
  ) {
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

  async loadLogo(logoId: string) {
    // @ts-expect-error TODO: still not documented
    const result = await this.raw.GET("/images/logos/{logoId}", {
      params: { path: { logoId } },
    });
    return result.data;
  }
}
