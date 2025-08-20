import { FetchResponse } from "openapi-fetch";
import { MediaType } from "openapi-typescript-helpers";

export function dataOrThrow<
  T extends Record<string | number, any>,
  Options,
  Media extends MediaType,
>(response: FetchResponse<T, Options, Media>) {
  response.error;
  if ("error" in response) {
    throw new Error(String(response.error));
  }

  return response.data;
}
