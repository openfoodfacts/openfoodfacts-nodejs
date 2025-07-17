import { OpenFoodFacts } from "../src/main";
import { TestUtils } from "./utils/test-utils";
import productMock from "./mockdata/product-v3-3154230805984.json";

describe("getProductV3", () => {
  it("should return product details for a valid barcode and fields", async () => {
    // Mock the fetch to return a successful response with product data
    const mockFetch = jest
      .fn<ReturnType<typeof window.fetch>, [string, RequestInit]>()
      .mockResolvedValue(TestUtils.mockResponse(productMock));

    const client = new OpenFoodFacts(mockFetch as any, { country: "world" });

    const result = await client.getProductV3("3154230805984", {
      fields: ["product_name"],
    });

    console.debug("result", result);
    expect(mockFetch).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.product.product_name).toBe(productMock.product.product_name);
  });
});
