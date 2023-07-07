export {};

import * as NodeFetch from "node-fetch";
import * as FormData from "formdata-node";
import { components, external } from "./schemas/server/docs/api/ref/api";

export type Product = components["schemas"]["Product"];
export type SearchResult = external["responses/search_for_products.yaml"];

declare global {
  type File = FormData.File;
  type FormData = FormData.FormData;
  type RequestInit = NodeFetch.RequestInit;
  type Request = NodeFetch.Request;
  type Response = NodeFetch.Response;

  namespace globalThis {
    const fetch: typeof NodeFetch.default;
  }

  var File: File;
  var Blob: typeof Blob;
}
