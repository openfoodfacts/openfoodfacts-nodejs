import createClient from "openapi-fetch";

import { paths, components } from "./schemas/folksonomy";
import { formBody as formBodySerializer } from "./formbody";
import { ApiError } from "./error";

export type FolksonomyTag = components["schemas"]["ProductTag"];
export type FolksonomyKey = {
  k: string;
  count: number;
  values: number;
};

export class Folksonomy {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  readonly raw: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch, authToken: string) {
    this.baseUrl = "https://api.folksonomy.openfoodfacts.org";

    this.fetch = fetch;
    this.raw = createClient({
      baseUrl: this.baseUrl,
      fetch,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  /**
   * Get the list of keys with statistics
   *
   * The keys list can be restricted to private tags from some owner.
   */
  async getKeys(): Promise<FolksonomyKey[]> {
    const res = await this.raw.GET("/keys");
    return res.response.json();
  }

  /**
   * Get the list of products that have a `key` or `key=value` if `value` is provided
   */
  async getProducts(key: string, value?: string): Promise<FolksonomyTag[]> {
    const res = await this.raw.GET("/products", {
      params: { query: { k: key, v: value } },
    });
    return res.response.json();
  }

  async putTag(tag: FolksonomyTag): Promise<boolean> {
    const res = await this.raw.PUT("/product", { body: tag });

    return res.response.status === 200;
  }

  /**
   * Get a list of existing tags for a product
   */
  async getProduct(barcode: string) {
    const res = await this.raw.GET("/product/{product}", {
      params: { path: { product: barcode } },
    });

    return res;
  }
  /**
   * Update a product tag (or add it if it does not exist)
   *
   * @param tag Tag to add or update with the following fields:
   * - `k`: key
   * - `v`: value
   * - `product`: barcode
   * - `version`: version of the tag (must be equal to previous version + 1)
   * - `owner`: user_id of the owner of the tag (empty for public tags)
   *
   * @returns if the tag was added or updated
   */
  async addTag(tag: FolksonomyTag): Promise<boolean> {
    const res = await this.raw.POST("/product", {
      body: tag,
    });

    return res.response.status === 200;
  }

  /**
   * Delete a product tag
   *
   * @returns if the tag was deleted
   */
  async removeTag(tag: FolksonomyTag & { version: number }) {
    const res = await this.raw.DELETE("/product/{product}/{k}", {
      params: {
        path: { product: tag.product, k: tag.k },
        query: { version: tag.version },
      },
    });

    return res;
  }

  /**
   * Authentication: provide user/password and get a bearer token in return
   *
   * @param username Open Food Facts user_id (not email)
   * @param password user password
   * @returns the bearer token, to be used in later requests with usual "Authorization: bearer token" headers
   */
  async login(
    username: string,
    password: string
  ): Promise<
    | { token: { access_token: string; token_type: string } }
    | { error: ApiError }
  > {
    const res = await this.raw.POST("/auth", {
      body: { username, password },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      bodySerializer: formBodySerializer,
    });

    if (res.response.status !== 200) {
      return {
        error: {
          detail: [
            {
              msg: "Status code " + res.response.status,
              type: "error",
              loc: [],
            },
          ],
        },
      };
    } else if (res.error != null) {
      return { error: res.error };
    }

    const token = (await res.response.json()) as {
      access_token: string;
      token_type: string;
    };

    return { token };
  }
}
