import { describe, it, expect } from "@jest/globals";
import { OpenFoodFacts, PlatformType } from "../src/main";
import { PLATFORM_DOMAINS, PLATFORM_NAMES } from "../src/consts";

describe("Platform support tests", () => {
  const dummyFetch = (() => Promise.resolve(new Response())) as typeof fetch;

  it("should set the correct baseUrl for food platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      platform: "food",
      country: "world",
    });
    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(PLATFORM_DOMAINS.FOOD);
  });

  it("should set the correct baseUrl for beauty platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      country: "world",
      platform: "beauty",
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(PLATFORM_DOMAINS.BEAUTY);
  });

  it("should set the correct baseUrl for petfood platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      country: "world",
      platform: "petfood",
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(PLATFORM_DOMAINS.PET_FOOD);
  });

  it("should set the correct baseUrl for products platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      country: "world",
      platform: "products",
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(PLATFORM_DOMAINS.PRODUCTS);
  });

  it("should set the correct User-Agent header based on platform", () => {
    const platforms: PlatformType[] = ["food", "beauty", "petfood", "products"];
    const expectedAgentPrefixes = [
      PLATFORM_NAMES.FOOD,
      PLATFORM_NAMES.BEAUTY,
      PLATFORM_NAMES.PET_FOOD,
      PLATFORM_NAMES.PRODUCTS,
    ];

    for (let i = 0; i < platforms.length; i++) {
      const off = new OpenFoodFacts(dummyFetch, {
        country: "world",
        platform: platforms[i],
      });

      // @ts-ignore - accessing private property for testing
      expect(off.customUserAgent).toContain(expectedAgentPrefixes[i]);
    }
  });

  it("should accept a custom host", () => {
    const customHost = "https://test.openfoodfacts.org";
    const off = new OpenFoodFacts(dummyFetch, {
      platform: "food",
      customHost: customHost,
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toBe(customHost);
  });

  it("should throw an error if neither country nor customHost is provided", () => {
    function createClientWithoutCountryOrHost() {
      return new OpenFoodFacts(dummyFetch, {
        platform: "food",
      });
    }

    expect(createClientWithoutCountryOrHost).toThrow(
      "Either 'customHost' or 'country' must be provided in options",
    );
  });
});
