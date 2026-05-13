import OpenFoodFacts, {
  getProductImageUrl,
  getProductIngredientsInLang,
  getProductNameInLang,
} from "../src";

import { TestUtils } from "./utils/test-utils";
import productMockData from "./mockdata/product-7622210288257.json";
import productV3MockData from "./mockdata/product-v3-3154230805984.json";
import { ProductDataType } from "../src/off-v3";
import { formData } from "../src/openapi";

describe("OpenFoodFacts", () => {
  let mockFetch: jest.Mock<Promise<Response>, Parameters<typeof global.fetch>>;
  let productsApi: OpenFoodFacts;

  // Common test data
  const testBarcode = "7622210288257";
  const testBarcodeV3 = "3154230805984";
  const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

  // Helper functions
  const mockV2Success = (data: any) =>
    jest.spyOn(productsApi.apiv2.client, "GET").mockResolvedValue({ data });
  const mockV3Success = (data: any) =>
    jest.spyOn(productsApi.apiv3.client, "GET").mockResolvedValue({ data });

  const mockV2Error = (error: Error) =>
    jest.spyOn(productsApi.apiv2.client, "GET").mockRejectedValue(error);

  // Uncomment if needed
  //const mockV3Error = (error: Error) =>
  //  jest.spyOn(productsApi.apiv3.client, "GET").mockRejectedValue(error);

  const mockFetchSuccess = (data: any) =>
    mockFetch.mockResolvedValue(TestUtils.mockResponse(data, true, 200));

  // Uncomment if needed
  //const mockFetchError = (error: Error) => mockFetch.mockRejectedValue(error);

  beforeEach(() => {
    mockFetch = jest.fn();
    productsApi = new OpenFoodFacts(mockFetch as any, {
      host: "https://world.openfoodfacts.org",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      expect(productsApi).toBeInstanceOf(OpenFoodFacts);
      expect(productsApi.apiv2).toBeDefined();
      expect(productsApi.apiv3).toBeDefined();
    });

    it("should initialize with custom options", () => {
      const customApi = new OpenFoodFacts(mockFetch, {
        country: "france",
      });

      expect(customApi).toBeInstanceOf(OpenFoodFacts);
    });
  });

  describe("individual taxonomy getters", () => {
    const mockTaxoEntry = {
      name: { en: "Test Entry" },
      parents: [],
      children: [],
    };

    beforeEach(() => {
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse(mockTaxoEntry, true, 200),
      );
    });

    it("should fetch a single category by name", async () => {
      const result = await productsApi.getCategory("en:beverages");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=categories&tags=en:beverages"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single label by name", async () => {
      const result = await productsApi.getLabel("en:organic");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=labels&tags=en:organic"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single additive by name", async () => {
      const result = await productsApi.getAdditive("en:e322");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=additives&tags=en:e322"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single allergen by name", async () => {
      const result = await productsApi.getAllergen("en:gluten");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=allergens&tags=en:gluten"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single country by name", async () => {
      const result = await productsApi.getCountry("en:france");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=countries&tags=en:france"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single ingredient by name", async () => {
      const result = await productsApi.getIngredient("en:sugar");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=ingredients&tags=en:sugar"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single packaging entry by name", async () => {
      const result = await productsApi.getPackaging("en:plastic");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=packaging&tags=en:plastic"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single state by name", async () => {
      const result = await productsApi.getState("en:complete");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=states&tags=en:complete"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single store by name", async () => {
      const result = await productsApi.getStore("en:carrefour");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=stores&tags=en:carrefour"),
        expect.objectContaining({}),
      );
    });

    it("should fetch a single nutrient by name", async () => {
      const result = await productsApi.getNutrient("en:energy");
      expect(result).toEqual(mockTaxoEntry);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("tagtype=nutrients&tags=en:energy"),
        expect.objectContaining({}),
      );
    });
  });

  describe("getProductAttributes", () => {
    it("should return product attributes for a valid barcode", async () => {
      const mockData = {
        product: {
          attribute_groups_en: [
            {
              id: "nutritional_quality",
              name: "Nutritional quality",
              attributes: [
                {
                  id: "nutriscore",
                  name: "Nutri-Score",
                  grade: "c",
                  title: "Average nutritional quality",
                },
              ],
            },
          ],
        },
      };

      mockV2Success(mockData);

      const result = await productsApi.getProductAttributes(testBarcode);

      expect(result).toBeDefined();
      expect(result).toEqual(mockData.product.attribute_groups_en);
      expect(productsApi.apiv2.client.GET).toHaveBeenCalledWith(
        "/api/v2/product/{code}",
        {
          params: {
            path: { code: testBarcode },
            query: { fields: "product_name,code,attribute_groups_en" },
          },
        },
      );
    });

    it("should return empty array when no attributes found", async () => {
      mockV2Success({ product: null });

      const result = await productsApi.getProductAttributes("invalid");

      expect(result).toEqual([]);
    });
  });

  describe("getProductV3", () => {
    it("should return product details for a valid barcode and fields", async () => {
      const mockData = {
        status: "success",
        product: {
          product_name: "Test Product",
          brands: "Test Brand",
        },
      };

      mockV3Success(mockData);

      const { data, error } = await productsApi.getProductV3(testBarcode, {
        fields: ["product_name", "brands"],
      });

      expect(error).toBeUndefined();
      expect(data).toBeDefined();
      expect(data).toEqual(mockData);
      expect(productsApi.apiv3.client.GET).toHaveBeenCalledWith(
        "/api/v3/product/{code}",
        {
          params: {
            path: { code: testBarcode },
            query: { fields: "product_name,brands" },
          },
        },
      );
    });

    it("should return product details without specific fields", async () => {
      mockV3Success(productV3MockData);

      const { data, error } = await productsApi.getProductV3(testBarcodeV3);

      expect(error).toBeUndefined();

      expect(data).toBeDefined();
      if (!data) return; // type narrowing

      expect(data).toEqual(productV3MockData);
      expect(productsApi.apiv3.client.GET).toHaveBeenCalledWith(
        "/api/v3/product/{code}",
        {
          params: {
            path: { code: testBarcodeV3 },
            query: { fields: undefined },
          },
        },
      );

      expect(data.status).toBe("success");
      if (data.status !== "success") return; // for type narrowing

      expect(data.product).toEqual(productV3MockData.product);
    });
  });

  describe("getProductV2", () => {
    it("should return product details for a valid barcode", async () => {
      const mockData = {
        product: productMockData.product,
      };

      mockV2Success(mockData);

      const { data, error } = await productsApi.getProductV2(testBarcode);

      expect(error).toBeUndefined();
      expect(data).toBeDefined();
      expect(data).toEqual(mockData);

      expect(productsApi.apiv2.client.GET).toHaveBeenCalledWith(
        "/api/v2/product/{code}",
        {
          params: { path: { code: testBarcode } },
        },
      );
    });

    it("should return null when product not found", async () => {
      mockV2Success({ product: null });

      const { data, error } = await productsApi.getProductV2("invalid");

      expect(error).toBeUndefined();
      expect(data).toBeDefined();
      expect(data?.product).toBeNull();
    });
  });

  describe("getProductImages", () => {
    it("should fetch product images successfully", async () => {
      const mockResponse = {
        product: {
          images: {
            front: { rev: "1" },
            ingredients: { rev: "2" },
            nutrition: { rev: "3" },
          },
        },
      };

      mockV2Success(mockResponse);

      const result = await productsApi.getProductImages(testBarcode);

      expect(result).toEqual(["front", "ingredients", "nutrition"]);
      expect(productsApi.apiv2.client.GET).toHaveBeenCalledWith(
        "/api/v2/product/{code}",
        {
          params: {
            query: { fields: "images" },
            path: { code: testBarcode },
          },
        },
      );
    });

    it("should return null when no product found", async () => {
      mockV2Success({ product: null });

      const result = await productsApi.getProductImages("invalid");

      expect(result).toBeNull();
    });

    it("should return null when product has no images", async () => {
      const mockResponse = {
        product: {
          code: testBarcode,
        },
      };

      mockV2Success(mockResponse);

      const result = await productsApi.getProductImages(testBarcode);

      expect(result).toBeNull();
    });
  });

  describe("uploadImage", () => {
    it("should upload image successfully for a valid barcode", async () => {
      const mockResponseData = {
        status: "success",
        image_id: "123",
      };

      mockFetchSuccess(mockResponseData);

      const { data, error } = await productsApi.uploadImage(
        testBarcode,
        mockFile,
        "front",
      );

      expect(mockFetch).toHaveBeenCalled();
      expect(data).toBeDefined();
      expect(error).toBeUndefined();
      expect(data).toEqual(mockResponseData);
    });

    it("should throw error when upload fails", async () => {
      mockFetch.mockResolvedValue(TestUtils.mockResponse({}, false, 500));

      const { data, error } = await productsApi.uploadImage(
        testBarcode,
        mockFile,
        "front",
      );
      expect(error).toBeDefined();
      expect(data).toBeUndefined();
    });
  });

  describe("addOrEditProductV2", () => {
    const baseProductData = {
      code: testBarcode,
      product_name: "Test Product",
      brands: "Test Brand",
      categories: "Test Category",
      quantity: "100g",
      languages_codes: { en: 1 },
      // Required ProductDataSection fields
      created_t: Date.now(),
      creator: "test",
      last_modified_t: Date.now(),
      last_editor: "test",
      editors_tags: [],
      last_checked_t: Date.now(),
      checkers_tags: [],
      states_hierarchy: [],
      // Required Product fields
      knowledge_panels: {},
      _id: testBarcode,
      _keywords: [],
      additives_n: 0,
      ingredients: [],
      additives_tags: [],
      ingredients_text: "",
      image_front_url: "",
      image_front_small_url: "",
      image_ingredients_url: "",
      image_ingredients_small_url: "",
      image_ingredients_thumb_url: "",
      images: {},
      image_nutrition_url: "",
      image_nutrition_small_url: "",
      image_nutrition_thumb_url: "",
      serving_size: "",
      nutriscore_grade: "",
      ecoscore_grade: "",
      nova_group: 1,
      packaging: "",
      manufacturing_places: "",
      brands_tags: [],
      categories_tags: [],
      categories_hierarchy: [],
      stores: "",
      stores_tags: [],
      labels: "",
      labels_tags: [],
      product_type: "",
      origins: "",
      origins_tags: [],
      countries: "",
      countries_tags: [],
      emb_codes: "",
      emb_codes_tags: [],
      nutriments: {},
      source: {
        fields: [],
        id: "",
        images: [],
        import_t: Date.now(),
        manufacturer: "",
        name: "",
        source_licence: "",
        source_licence_url: "",
      },
      link: "",
      lang: "en",
    };

    const testCredentials = { username: "testuser", password: "testpass" };

    it("should add/edit product successfully", async () => {
      mockFetch.mockResolvedValue(TestUtils.mockResponse({}, true, 200));

      const result = await productsApi.addOrEditProductV2(
        baseProductData,
        testCredentials,
      );

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://world.openfoodfacts.org/cgi/product_jqm2.pl",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });

    it("should return false when request fails", async () => {
      mockFetch.mockResolvedValue(TestUtils.mockResponse({}, false, 400));

      const minimalProductData = {
        code: testBarcode,
        product_name: "Test Product",
        languages_codes: {},
      } as any;

      const result = await productsApi.addOrEditProductV2(
        minimalProductData,
        testCredentials,
      );

      expect(result).toBe(false);
    });
  });

  describe("getProductImageUrl", () => {
    const mockSelectedImage = {
      front: {
        angle: 0,
        coordinates_image_size: "400x400",
        geometry: "0x0+0+0",
        imgid: "1",
        normalize: null,
        rev: "1",
        sizes: {
          100: { h: 100, w: 100 },
          200: { h: 200, w: 200 },
          400: { h: 400, w: 400 },
          full: { h: 800, w: 800 },
        },
        white_magic: null,
        x1: "0",
        x2: "400",
        y1: "0",
        y2: "400",
      },
    };

    const mockRawImage = {
      front: {
        url: "https://example.com/image.jpg",
        sizes: {
          100: { h: 100, w: 100 },
          400: { h: 400, w: 400 },
          full: { h: 800, w: 800 },
        },
        uploaded_t: "1234567890",
        uploader: "test",
      },
    };

    it("should generate correct image URL with selected image", () => {
      const result = getProductImageUrl(
        testBarcode,
        "front",
        mockSelectedImage,
        "400",
      );

      expect(result).toContain("front.1.400.jpg");
      expect(result).toContain("762/221/028/8257");
    });

    it("should generate correct image URL with raw image", () => {
      const result = getProductImageUrl(
        testBarcode,
        "front",
        mockRawImage,
        "400",
      );

      expect(result).toContain("front.400.jpg");
      expect(result).toContain("762/221/028/8257");
    });

    it("should return null when image not found", () => {
      const result = getProductImageUrl(testBarcode, "front", {}, "400");

      expect(result).toBeNull();
    });

    it("should return null when image not found in images object", () => {
      const result = getProductImageUrl(
        testBarcode,
        "nonexistent",
        mockSelectedImage,
        "400",
      );
      expect(result).toBeNull();
    });

    it("should handle different image sizes correctly", () => {
      const result100 = getProductImageUrl(
        testBarcode,
        "front",
        mockSelectedImage,
        "100",
      );
      const result200 = getProductImageUrl(
        testBarcode,
        "front",
        mockSelectedImage,
        "200",
      );
      const resultFull = getProductImageUrl(
        testBarcode,
        "front",
        mockSelectedImage,
        "full",
      );

      expect(result100).toContain("front.1.100.jpg");
      expect(result200).toContain("front.1.200.jpg");
      expect(resultFull).toContain("front.1.full.jpg");
    });

    it("should handle barcode padding correctly", () => {
      const shortBarcode = "123";
      const result = getProductImageUrl(
        shortBarcode,
        "front",
        mockSelectedImage,
        "400",
      );

      // Should pad the barcode to 13 digits: 0000000000123
      expect(result).toContain("000/000/000/0123");
    });
  });

  describe("private helper methods", () => {
    it("should format form data correctly", () => {
      const data = {
        field1: "value1",
        field2: "value2",
      };

      // Access the private method through instance
      const form = formData(data);

      expect(form).toBeInstanceOf(FormData);
    });

    it("should handle getProductNameInLang correctly", () => {
      const product = {
        product_name: "Default Product",
        product_name_fr: "Produit Français",
        product_name_es: "Producto Español",
      } as unknown as ProductDataType;

      expect(getProductNameInLang(product, "fr")).toBe("Produit Français");
      expect(getProductNameInLang(product, "es")).toBe("Producto Español");
      expect(getProductNameInLang(product, "de")).toBe("Default Product"); // fallback
    });

    it("should handle getProductIngredientsInLang correctly", () => {
      const product = {
        ingredients_text: "Default ingredients",
        ingredients_text_fr: "Ingrédients français",
        ingredients_text_es: "Ingredientes españoles",
      } as any;

      // Access private method through instance

      expect(getProductIngredientsInLang(product, "fr")).toBe(
        "Ingrédients français",
      );
      expect(getProductIngredientsInLang(product, "es")).toBe(
        "Ingredientes españoles",
      );
      expect(getProductIngredientsInLang(product, "de")).toBe(
        "Default ingredients",
      ); // fallback
    });
  });

  describe("isTokenExpired edge cases", () => {
    const createDummyToken = (payloadObj: any) => {
      const payloadBase64 = Buffer.from(JSON.stringify(payloadObj)).toString(
        "base64",
      );
      return `dummyHeader.${payloadBase64}.dummySignature`;
    };

    it("should treat a token with exp = 0 as expired", () => {
      const token = createDummyToken({ exp: 0 });
      const isExpired = (productsApi as any).isTokenExpired(token);
      expect(isExpired).toBe(true);
    });

    it("should treat a token with no exp as expired", () => {
      const token = createDummyToken({ userId: 123 });
      const isExpired = (productsApi as any).isTokenExpired(token);
      expect(isExpired).toBe(true);
    });
  });

  describe("error handling and edge cases", () => {
    const testCases = [
      { description: "empty barcode", barcode: "", expected: null },
      {
        description: "very long barcode",
        barcode: "1234567890123456789012345678901234567890",
        expected: { code: "1234567890123456789012345678901234567890" },
      },
      {
        description: "special characters in barcode",
        barcode: "123-456-789",
        expected: { code: "123-456-789" },
      },
    ];

    testCases.forEach(({ description, barcode, expected }) => {
      it(`should handle ${description} gracefully`, async () => {
        const mockResponse = {
          product: expected,
        };

        mockV2Success(mockResponse);

        const { data, error } = await productsApi.getProductV2(barcode);
        expect(error).toBeUndefined();
        expect(data).toEqual(mockResponse);
      });
    });

    it("should handle API timeout", async () => {
      mockV2Error(new Error("Request timeout"));

      await expect(productsApi.getProductV2(testBarcode)).rejects.toThrow(
        "Request timeout",
      );
    });
  });

  describe("getCurrentUserPermissions", () => {
    it("should return user permissions when authenticated", async () => {
      const mockData = {
        status: "success",
        result: { id: "user_found" },
        user: {
          userid: "stephane",
          name: "Stephane Gigandet",
          moderator: 1,
          admin: 1,
        },
      };

      mockFetchSuccess(mockData);

      const result = await productsApi.getCurrentUserPermissions();

      expect(result.error).toBeUndefined();
      expect(result.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        new URL(
          "/api/v3/current-user/permissions",
          "https://world.openfoodfacts.org",
        ),
        expect.anything(),
      );
    });

    it("should return error when not authenticated (401)", async () => {
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse(
          {
            status: "failure",
            errors: [
              {
                message: { id: "authentication_required" },
                impact: { id: "failure" },
              },
            ],
          },
          false,
          401,
        ),
      );

      const result = await productsApi.getCurrentUserPermissions();

      expect(result.data).toBeUndefined();
      expect(result.error).toBe("HTTP error! status: 401");
    });

    it("should throw on network error", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getCurrentUserPermissions()).rejects.toThrow(
        "Network error",
      );
    });
  });
});
