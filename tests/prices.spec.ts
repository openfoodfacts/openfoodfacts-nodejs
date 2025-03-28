import { PricesApi } from "../src/prices";
import { TestUtils } from "./utils/test-utils";
import crypto from "node:crypto";

describe("Prices Wrapper", () => {
  let fetchMock: jest.Mock;
  let client: PricesApi;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    client = new PricesApi(fetchMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  const getRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const array = new Uint32Array(10);
    crypto.getRandomValues(array);
    return Array.from(array, (num) => chars[num % chars.length]).join("");
  };

  const mockResponse = TestUtils.mockResponse;

  describe("Prices", () => {
    it("should fetch prices successfully", async () => {
      const mockData = { items: [{ product_code: "12345", price: 10 }] };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.getPrices({ product_code: "12345" });
      expect(result.data).toEqual(mockData);
    });

    it("should handle error when fetching prices", async () => {
      const errorData = { detail: "Internal Server Error" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 500));

      const result = await client.getPrices({ product_code: "12345" });
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(500);
    });

    it("should create a price successfully", async () => {
      const mockData = { product_code: "12345", price: 10 };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.createPrice({
        product_code: "12345",
        price: 10,
        currency: "USD",
        location_osm_id: 1,
        location_osm_type: "NODE",
        date: "2023-10-01",
      });
      expect(result.data).toEqual(mockData);
    });

    it("should handle error when creating a price", async () => {
      const errorData = { detail: "Bad Request" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 400));

      const result = await client.createPrice({
        product_code: "12345",
        price: 10,
        currency: "USD",
        location_osm_id: 1,
        location_osm_type: "NODE",
        date: "2023-10-01",
      });
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });
  });

  describe("Authenticate", () => {
    it("should login successfully", async () => {
      const mockData = { token: "test-token" };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.login({
        username: "test",
        password: getRandomPassword(),
      });
      expect(result.data).toEqual(mockData);
    });

    it("should handle error when logging in", async () => {
      const errorData = { detail: "Unauthorized" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 401));

      const result = await client.login({
        username: "test",
        password: getRandomPassword(),
      });
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(401);
    });

    it("should check authentication successfully", async () => {
      fetchMock.mockResolvedValue(mockResponse(null));

      const result = await client.isAuthenticated();
      expect(result).toBe(true);
    });
  });

  describe("Proofs", () => {
    it("should upload proof successfully", async () => {
      const mockData = { id: 1, file_path: "path/to/file" };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.uploadProof({ file: new Blob() });
      expect(result.data).toEqual(mockData);
    });

    it("should handle error when uploading proof", async () => {
      const errorData = { detail: "Internal Server Error" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 500));

      const result = await client.uploadProof({ file: new Blob() });
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(500);
    });

    it("should fetch proofs successfully", async () => {
      const mockData = { items: [{ id: 1, file_path: "path/to/file" }] };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.getProofs();
      expect(result.data).toEqual(mockData);
    });

    it("should handle error when fetching proofs", async () => {
      const errorData = { detail: "Not Found" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 404));

      const result = await client.getProofs();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(404);
    });
  });

  describe("Status", () => {
    it("should fetch API status successfully", async () => {
      const mockData = { status: "ok" };
      fetchMock.mockResolvedValue(mockResponse(mockData));

      const result = await client.getStatus();
      expect(result).toEqual(mockData);
    });

    it("should handle error when fetching API status", async () => {
      const errorData = { detail: "Internal Server Error" };
      fetchMock.mockResolvedValue(mockResponse(errorData, false, 500));

      const result = await client.getStatus();
      expect(result).toBeUndefined();
    });
  });
});
