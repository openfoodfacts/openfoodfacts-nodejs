import { ProductsApi } from "../src/products";
import { TestUtils } from "./utils/test-utils";
import productMockData from "./mockdata/product-7622210288257.json";
import productV3MockData from "./mockdata/product-v3-3154230805984.json";

describe("ProductsApi", () => {
  let mockFetch: jest.Mock<ReturnType<typeof window.fetch>, [RequestInfo | URL, RequestInit?]>;
  let productsApi: ProductsApi;

  beforeEach(() => {
    mockFetch = jest.fn<ReturnType<typeof window.fetch>, [RequestInfo | URL, RequestInit?]>();
    productsApi = new ProductsApi(mockFetch as any, {
      baseUrl: "https://world.openfoodfacts.org",
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      expect(productsApi).toBeInstanceOf(ProductsApi);
      expect(productsApi.rawV2).toBeDefined();
      expect(productsApi.rawV3).toBeDefined();
    });

    it("should initialize with custom options", () => {
      const customApi = new ProductsApi(mockFetch, {
        baseUrl: "https://custom.openfoodfacts.org",
        lang: "fr",
        country: "france",
        username: "testuser",
        password: "testpass",
      });

      expect(customApi).toBeInstanceOf(ProductsApi);
    });
  });

  describe("getProductAttributes", () => {
    it("should return product attributes for a valid barcode", async () => {
      // Mock the fetch to return a successful response with attribute data
      const mockData = {
        data: {
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
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductAttributes("7622210288257");

      expect(result).toBeDefined();
      expect(result).toEqual(mockData.data.product.attribute_groups_en);
      expect(productsApi.rawV2.GET).toHaveBeenCalledWith(
        "/api/v2/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: { fields: "product_name,code,attribute_groups_en" },
          },
        },
      );
    });

    it("should return empty array when no attributes found", async () => {
      const mockData = {
        data: {
          product: null,
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductAttributes("invalid");

      expect(result).toEqual([]);
    });

    it("should handle network errors when fetching attributes", async () => {
      jest.spyOn(productsApi.rawV2, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductAttributes("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("getProductV3", () => {
    it("should return product details for a valid barcode and fields", async () => {
      // Mock the fetch to return a successful response with product data
      const mockData = {
        data: {
          status: "success",
          product: {
            product_name: "Test Product",
            brands: "Test Brand",
          },
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductV3("7622210288257", {
        fields: ["product_name", "brands"],
      });

      console.debug("result", result);
      expect(result).toBeDefined();
      expect(result).toEqual(mockData.data);
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: { fields: "product_name,brands" },
          },
        },
      );
    });

    it("should return product details without specific fields", async () => {
      // Mock the fetch to return a successful response with full product data
      const mockData = {
        data: productV3MockData,
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductV3("3154230805984");

      expect(result).toBeDefined();
      expect(result).toEqual(mockData.data);
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "3154230805984" },
            query: { fields: undefined },
          },
        },
      );
    });

    it("should handle network errors when fetching product V3", async () => {
      jest.spyOn(productsApi.rawV3, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductV3("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("getProductV2", () => {
    it("should return product details for a valid barcode", async () => {
      // Mock the fetch to return a successful response with product data
      const mockData = {
        data: {
          product: productMockData.product,
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductV2("7622210288257");

      console.debug("result", result);
      expect(result).toBeDefined();
      expect(result).toEqual(mockData.data.product);
      expect(productsApi.rawV2.GET).toHaveBeenCalledWith(
        "/api/v2/product/{barcode}",
        {
          params: { path: { barcode: "7622210288257" } },
        },
      );
    });

    it("should return null when product not found", async () => {
      const mockData = {
        data: {
          product: null,
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockData);

      const result = await productsApi.getProductV2("invalid");

      expect(result).toBeNull();
    });

    it("should handle network errors", async () => {
      jest.spyOn(productsApi.rawV2, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductV2("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("getProductImages", () => {
    it("should fetch product images successfully", async () => {
      const mockResponse = {
        data: {
          product: {
            images: {
              front: { rev: "1" },
              ingredients: { rev: "2" },
              nutrition: { rev: "3" },
            },
          },
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductImages("7622210288257");

      expect(result).toEqual(["front", "ingredients", "nutrition"]);
      expect(productsApi.rawV2.GET).toHaveBeenCalledWith(
        "/api/v2/product/{barcode}",
        {
          params: {
            query: { fields: "images" },
            path: { barcode: "7622210288257" },
          },
        },
      );
    });

    it("should return null when no product found", async () => {
      const mockResponse = {
        data: {
          product: null,
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductImages("invalid");

      expect(result).toBeNull();
    });

    it("should return null when product has no images", async () => {
      const mockResponse = {
        data: {
          product: {
            code: "7622210288257",
          },
        },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductImages("7622210288257");

      expect(result).toBeNull();
    });

    it("should handle network errors when fetching images", async () => {
      jest.spyOn(productsApi.rawV2, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductImages("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("getProductName", () => {
    it("should fetch product name successfully", async () => {
      const mockResponse = {
        data: {
          status: "success",
          product: {
            product_name: "Test Product",
          },
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductName("7622210288257");

      expect(result).toEqual({ product_name: "Test Product" });
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: { fields: "product_name" },
          },
        },
      );
    });

    it("should fetch product name with language", async () => {
      const mockResponse = {
        data: {
          status: "success",
          product: {
            product_name: "Produit Test",
          },
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductName("7622210288257", "fr");

      expect(result).toEqual({ product_name: "Produit Test" });
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: { fields: "product_name", lc: "fr" },
          },
        },
      );
    });

    it("should return null when product not found", async () => {
      const mockResponse = {
        data: {
          status: "failure",
          errors: [],
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductName("invalid");

      expect(result).toBeNull();
    });

    it("should handle network errors when fetching product name", async () => {
      jest.spyOn(productsApi.rawV3, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductName("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("getProductReducedForCard", () => {
    it("should fetch reduced product data successfully", async () => {
      const mockResponse = {
        data: {
          status: "success",
          product: {
            code: "7622210288257",
            product_name: "Test Product",
            brands: "Test Brand",
            quantity: "100g",
            nutriscore_grade: "c",
            ecoscore_grade: "b",
            nova_group: 3,
            product_type: "food",
            image_front_small_url: "https://example.com/image.jpg",
          },
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductReducedForCard("7622210288257");

      expect(result).toEqual(mockResponse.data);
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: {
              fields: "image_front_small_url,code,product_name,brands,quantity,nutriscore_grade,ecoscore_grade,nova_group,product_type",
            },
          },
        },
      );
    });

    it("should fetch reduced product data with language", async () => {
      const mockResponse = {
        data: {
          status: "success",
          product: {
            code: "7622210288257",
            product_name: "Produit Test",
          },
        },
      };

      jest.spyOn(productsApi.rawV3, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductReducedForCard("7622210288257", "fr");

      expect(result).toEqual(mockResponse.data);
      expect(productsApi.rawV3.GET).toHaveBeenCalledWith(
        "/api/v3/product/{barcode}",
        {
          params: {
            path: { barcode: "7622210288257" },
            query: {
              fields: "image_front_small_url,code,product_name,brands,quantity,nutriscore_grade,ecoscore_grade,nova_group,product_type",
              lc: "fr",
            },
          },
        },
      );
    });

    it("should handle network errors when fetching reduced product data", async () => {
      jest.spyOn(productsApi.rawV3, "GET").mockRejectedValue(new Error("Network error"));

      await expect(productsApi.getProductReducedForCard("7622210288257")).rejects.toThrow("Network error");
    });
  });

  describe("uploadImage", () => {
    it("should upload image successfully for a valid barcode", async () => {
      // Mock the fetch to return a successful response
      const mockResponseData = {
        status: "success",
        image_id: "123",
      };

      mockFetch.mockResolvedValue(
        TestUtils.mockResponse(mockResponseData, true, 200),
      );

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const result = await productsApi.uploadImage("7622210288257", mockFile, "front");

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponseData);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://world.openfoodfacts.org/cgi/product_image_upload.pl",
        {
          method: "POST",
          body: expect.any(FormData),
          headers: {
            "User-Agent": expect.any(String),
          },
        },
      );
    });

    it("should throw error when upload fails", async () => {
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse({}, false, 500),
      );

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await expect(
        productsApi.uploadImage("7622210288257", mockFile, "front"),
      ).rejects.toThrow("Failed to upload image for product with barcode: 7622210288257");
    });

    it("should handle network errors during upload", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

      await expect(
        productsApi.uploadImage("7622210288257", mockFile, "front"),
      ).rejects.toThrow("Network error");
    });

    it("should properly format FormData for image upload", async () => {
      const mockResponseData = { status: "success" };
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse(mockResponseData, true, 200),
      );

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      await productsApi.uploadImage("7622210288257", mockFile, "front");

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs[1]).toBeDefined();
      
      const formData = callArgs[1]?.body as FormData;
      expect(formData).toBeInstanceOf(FormData);
      expect(formData.get("code")).toBe("7622210288257");
      expect(formData.get("imagefield")).toBe("front");
      expect(formData.get("imgupload_front")).toBe(mockFile);
    });
  });

  describe("addOrEditProductV2", () => {
    it("should add/edit product successfully", async () => {
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse({}, true, 200),
      );

      const productData = {
        code: "7622210288257",
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
        _id: "7622210288257",
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

      const result = await productsApi.addOrEditProductV2(productData, {
        username: "testuser",
        password: "testpass",
      });

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://world.openfoodfacts.org/cgi/product_jqm2.pl",
        {
          method: "POST",
          body: expect.any(FormData),
          headers: {
            "User-Agent": expect.any(String),
          },
        },
      );
    });

    it("should throw error when credentials are missing", async () => {
      const productData = {
        code: "7622210288257",
        product_name: "Test Product",
        languages_codes: {},
      } as any; // Use any to bypass type checking for minimal test data

      await expect(
        productsApi.addOrEditProductV2(productData),
      ).rejects.toThrow("Username and password are required");
    });

    it("should return false when request fails", async () => {
      mockFetch.mockResolvedValue(
        TestUtils.mockResponse({}, false, 400),
      );

      const productData = {
        code: "7622210288257",
        product_name: "Test Product",
        languages_codes: {},
      } as any; // Use any to bypass type checking for minimal test data

      const result = await productsApi.addOrEditProductV2(productData, {
        username: "testuser",
        password: "testpass",
      });

      expect(result).toBe(false);
    });

    it("should handle network errors during product update", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const productData = {
        code: "7622210288257",
        product_name: "Test Product",
        languages_codes: {},
      } as any;

      await expect(
        productsApi.addOrEditProductV2(productData, {
          username: "testuser",
          password: "testpass",
        }),
      ).rejects.toThrow("Network error");
    });

    it("should use default credentials when provided in constructor", async () => {
      const apiWithDefaults = new ProductsApi(mockFetch, {
        baseUrl: "https://world.openfoodfacts.org",
        username: "defaultuser",
        password: "defaultpass",
      });

      mockFetch.mockResolvedValue(
        TestUtils.mockResponse({}, true, 200),
      );

      const productData = {
        code: "7622210288257",
        product_name: "Test Product",
        languages_codes: {},
      } as any;

      const result = await apiWithDefaults.addOrEditProductV2(productData);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://world.openfoodfacts.org/cgi/product_jqm2.pl",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });
  });

  describe("getProductImageUrl", () => {
    it("should generate correct image URL with selected image", () => {
      const barcode = "7622210288257";
      const imageName = "front";
      const images = {
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

      const result = ProductsApi.getProductImageUrl(barcode, imageName, images, "400");

      expect(result).toContain("front.1.400.jpg");
      expect(result).toContain("762/221/028/8257");
    });

    it("should generate correct image URL with raw image", () => {
      const barcode = "7622210288257";
      const imageName = "front";
      const images = {
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

      const result = ProductsApi.getProductImageUrl(barcode, imageName, images, "400");

      expect(result).toContain("front.400.jpg");
      expect(result).toContain("762/221/028/8257");
    });

    it("should return null when image not found", () => {
      const barcode = "7622210288257";
      const imageName = "front";
      const images = {};

      const result = ProductsApi.getProductImageUrl(barcode, imageName, images, "400");

      expect(result).toBeNull();
    });

    it("should return null when image not found in images object", () => {
      const barcode = "7622210288257";
      const imageName = "nonexistent";
      const images = {
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

      const result = ProductsApi.getProductImageUrl(barcode, imageName, images, "400");
      expect(result).toBeNull();
    });

    it("should handle different image sizes correctly", () => {
      const barcode = "7622210288257";
      const imageName = "front";
      const images = {
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

      const result100 = ProductsApi.getProductImageUrl(barcode, imageName, images, "100");
      const result200 = ProductsApi.getProductImageUrl(barcode, imageName, images, "200");
      const resultFull = ProductsApi.getProductImageUrl(barcode, imageName, images, "full");

      expect(result100).toContain("front.1.100.jpg");
      expect(result200).toContain("front.1.200.jpg");
      expect(resultFull).toContain("front.1.full.jpg");
    });

    it("should handle barcode padding correctly", () => {
      const shortBarcode = "123";
      const imageName = "front";
      const images = {
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

      const result = ProductsApi.getProductImageUrl(shortBarcode, imageName, images, "400");
      
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

      // Access the private method through prototype
      const formData = (ProductsApi as any).formData(data);

      expect(formData).toBeInstanceOf(FormData);
    });

    it("should handle getProductNameInLang correctly", () => {
      const product = {
        product_name: "Default Product",
        product_name_fr: "Produit Français",
        product_name_es: "Producto Español",
      } as any;

      // Access private method through prototype
      const getNameInLang = (ProductsApi as any).getProductNameInLang;
      
      expect(getNameInLang(product, "fr")).toBe("Produit Français");
      expect(getNameInLang(product, "es")).toBe("Producto Español");
      expect(getNameInLang(product, "de")).toBe("Default Product"); // fallback
    });

    it("should handle getProductIngredientsInLang correctly", () => {
      const product = {
        ingredients_text: "Default ingredients",
        ingredients_text_fr: "Ingrédients français",
        ingredients_text_es: "Ingredientes españoles",
      } as any;

      // Access private method through prototype
      const getIngredientsInLang = (ProductsApi as any).getProductIngredientsInLang;
      
      expect(getIngredientsInLang(product, "fr")).toBe("Ingrédients français");
      expect(getIngredientsInLang(product, "es")).toBe("Ingredientes españoles");
      expect(getIngredientsInLang(product, "de")).toBe("Default ingredients"); // fallback
    });
  });

  describe("error handling and edge cases", () => {
    it("should handle empty barcode gracefully", async () => {
      const mockResponse = {
        data: { product: null },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductV2("");
      expect(result).toBeNull();
    });

    it("should handle very long barcode", async () => {
      const longBarcode = "1234567890123456789012345678901234567890";
      const mockResponse = {
        data: { product: { code: longBarcode } },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductV2(longBarcode);
      expect(result).toEqual({ code: longBarcode });
    });

    it("should handle special characters in barcode", async () => {
      const specialBarcode = "123-456-789";
      const mockResponse = {
        data: { product: { code: specialBarcode } },
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(mockResponse);

      const result = await productsApi.getProductV2(specialBarcode);
      expect(result).toEqual({ code: specialBarcode });
    });

    it("should handle API timeout", async () => {
      jest.spyOn(productsApi.rawV2, "GET").mockRejectedValue(new Error("Request timeout"));

      await expect(productsApi.getProductV2("7622210288257")).rejects.toThrow("Request timeout");
    });

    it("should handle malformed API response", async () => {
      const malformedResponse = {
        data: "invalid json",
      };

      jest.spyOn(productsApi.rawV2, "GET").mockResolvedValue(malformedResponse);

      const result = await productsApi.getProductV2("7622210288257");
      expect(result).toBeUndefined();
    });
  });
});
