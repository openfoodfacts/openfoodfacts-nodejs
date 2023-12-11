import { paths } from "../schemas/robotoff";
import createClient from "openapi-fetch";

export default class Robotoff {
  private readonly fetch: typeof global.fetch;

  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch) {
    this.fetch = fetch;
    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: "https://robotoff.openfoodfacts.org",
    });
  }

  async annotate(
    body: paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"]
  ) {
    return this.client.POST("/insights/annotate", {
      body: body,
    });
  }

  async questionsByProductCode(code: number) {
    const result = await this.client.GET("/questions/{barcode}", {
      params: {
        path: { barcode: code },
      },
    });
    return result.data;
  }

  async insightDetail(id: string) {
    const result = await this.client.GET("/insights/detail/{id}", {
      params: { path: { id } },
    });
    return result.data;
  }

  async loadLogo(logoId: string) {
    // @ts-expect-error TODO: still not documented
    const result = await this.client.GET("/images/logos/{logoId}", {
      params: { path: { logoId } },
    });
    return result.data;
  }
}
