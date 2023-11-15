import { RequestInfo } from "node-fetch";
import { paths, components } from "../schemas/robotoff";
import createClient from "openapi-fetch";

export class Robotoff {
  private readonly fetch: (
    url: URL | RequestInfo,
    init?: RequestInit
  ) => Promise<Response>;

  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    fetch: (url: URL | RequestInfo, init?: RequestInit) => Promise<Response>
  ) {
    this.fetch = fetch;
    this.client = createClient<paths>({
      fetch: this.fetch,
      baseUrl: "https://robotoff.openfoodfacts.org",
    });
  }

  async annotate(
    body: paths["/insights/annotate"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"]
  ) {
    return this.client.post("/insights/annotate", {
      body: body,
    });
  }

  async questionsByProductCode(code: number) {
    const result = await this.client.get("/questions/{barcode}", {
      params: {
        path: { barcode: code },
      },
    });
    return result.data;
  }

  async insightDetail(id: string) {
    const result = await this.client.get("/insights/detail/{id}", {
      params: { path: { id } },
    });
    return result.data;
  }

  async loadLogo(logoId: string) {
    // @ts-expect-error TODO: still not documented
    const result = await this.client.get("/images/logos/{logoId}", {
      params: {
        path: { logoId },
      },
    });
    return result.data;
  }
}
