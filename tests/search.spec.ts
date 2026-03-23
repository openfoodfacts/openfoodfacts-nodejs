import { SearchApi } from "../src/search";
import { USER_AGENT } from "../src/consts";

describe("SearchApi Wrapper", () => {
  let fetchMock: jest.Mock;
  let client: SearchApi;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    client = new SearchApi(fetchMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockResponse = (data: any, ok = true, status = 200) => {
    return {
      ok,
      status,
      headers: {
        get: (header: string) => {
          const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
          };
          return headers[header];
        },
      },
      json: async () => data,
      text: async () => JSON.stringify(data),
      clone: () => ({ json: async () => data }),
    };
  };

  describe("Document", () => {
    it("should fetch document successfully", async () => {
      const data = { id: "123", content: "test" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.getDocument("123");
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should handle error when fetching document", async () => {
      fetchMock.mockResolvedValue(mockResponse(null, false, 404));

      const result = await client.getDocument("123");
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(404);
    });
  });

  describe("Search", () => {
    it("should perform POST search successfully", async () => {
      const data = { results: [{ id: 1 }] };
      const body = {
        q: "test",
        langs: ["en"],
        page_size: 20,
        page: 1,
      };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.search(body);
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should perform GET search successfully", async () => {
      const data = { results: [{ id: 1 }] };
      const query = { q: "test" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.searchGet(query);
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should handle error when performing POST search", async () => {
      const body = {
        q: "test",
        langs: ["en"],
        page_size: 20,
        page: 1,
      };
      fetchMock.mockResolvedValue(mockResponse(null, false, 400));

      const result = await client.search(body);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });
  });

  describe("Autocomplete", () => {
    it("should fetch autocomplete successfully", async () => {
      const data = { suggestions: ["test1", "test2"] };
      const query = {
        q: "test",
        taxonomy_names: "products",
      };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.autocomplete(query);
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should handle error when fetching autocomplete", async () => {
      const query = {
        q: "test",
        taxonomy_names: "products",
      };
      fetchMock.mockResolvedValue(mockResponse(null, false, 500));

      const result = await client.autocomplete(query);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(500);
    });
  });

  describe("Demo and Utilities", () => {
    it("should fetch OFF demo successfully", async () => {
      const data = { status: "ok" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.getOffDemo();
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should perform HTML search successfully", async () => {
      const data = { html: "<div>test</div>" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.htmlSearch();
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should fetch robots.txt successfully", async () => {
      const data = { content: "User-agent: *" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.getRobotsTxt();
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should perform health check successfully", async () => {
      const data = { status: "healthy" };
      fetchMock.mockResolvedValue(mockResponse(data));

      const result = await client.healthCheck();
      expect(result.data).toEqual(data);
      expect(result.response).toBeDefined();
      expect(result.response.ok).toBe(true);
    });

    it("should handle error when fetching health check", async () => {
      fetchMock.mockResolvedValue(mockResponse(null, false, 503));

      const result = await client.healthCheck();
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(503);
    });
  });

  describe("Malformed responses", () => {
    it("should return null data when 200 response body is null", async () => {
      // openapi-fetch treats 200 + null body as a successful response
      // with data === null. The SDK should not crash in this case.
      fetchMock.mockResolvedValue(mockResponse(null));

      const result = await client.search({
        q: "test",
        langs: ["en"],
        page_size: 20,
        page: 1,
      });
      // null body comes back as null data — callers must check before iterating
      expect(result.data).toBeNull();
      expect(result.response.status).toBe(200);
    });

    it("should return hits as empty array when 200 response is missing hits field", async () => {
      // Backend returns 200 but hits is undefined — guard should warn and fallback
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      fetchMock.mockResolvedValue(mockResponse({ count: 0 }));

      const result = await client.search({
        q: "test",
        langs: ["en"],
        page_size: 20,
        page: 1,
      });

      expect(result.data).toBeDefined();
      expect(result.data!.hits).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing 'hits' field"),
        expect.anything(),
      );
      consoleSpy.mockRestore();
    });

    it("should return empty hits as fallback for GET search when hits field is missing", async () => {
      // Same guard applies to searchGet()
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      fetchMock.mockResolvedValue(mockResponse({ count: 0 }));

      const result = await client.searchGet({ q: "test" });

      expect(result.data).toBeDefined();
      expect(result.data!.hits).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing 'hits' field"),
        expect.anything(),
      );
      consoleSpy.mockRestore();
    });

    it("should return hits as empty array when hits is a non-array value in POST search", async () => {
      // The Array.isArray guard also catches malformed values like {} or strings,
      // not just null/undefined — this test documents that behaviour.
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      fetchMock.mockResolvedValue(mockResponse({ count: 1, hits: {} }));

      const result = await client.search({
        q: "test",
        langs: ["en"],
        page_size: 20,
        page: 1,
      });

      expect(result.data).toBeDefined();
      expect(result.data!.hits).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing 'hits' field"),
        expect.anything(),
      );
      consoleSpy.mockRestore();
    });

    it("should return hits as empty array when hits is a non-array value in GET search", async () => {
      // Same Array.isArray guard applies to searchGet()
      const consoleSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      fetchMock.mockResolvedValue(mockResponse({ count: 1, hits: {} }));

      const result = await client.searchGet({ q: "test" });

      expect(result.data).toBeDefined();
      expect(result.data!.hits).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing 'hits' field"),
        expect.anything(),
      );
      consoleSpy.mockRestore();
    });
  });
});
