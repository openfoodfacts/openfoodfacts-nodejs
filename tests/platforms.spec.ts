import { describe, it, expect } from "@jest/globals";
import { OpenFoodFacts } from "../src/main";
import { BackendType, BACKEND_DOMAINS, BACKEND_NAMES } from "../src/consts";

describe("Platform support tests", () => {
  const dummyFetch = (() => Promise.resolve(new Response())) as typeof fetch;

  it("should set the correct baseUrl for OFF platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      type: BackendType.OFF,
    });
    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(BACKEND_DOMAINS[BackendType.OFF]);
  });

  it("should set the correct baseUrl for OBF platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      type: BackendType.OBF,
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(BACKEND_DOMAINS[BackendType.OBF]);
  });

  it("should set the correct baseUrl for OPFF platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      type: BackendType.OPFF,
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(BACKEND_DOMAINS[BackendType.OPFF]);
  });

  it("should set the correct baseUrl for OPF platform", () => {
    const off = new OpenFoodFacts(dummyFetch, {
      type: BackendType.OPF,
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toContain(BACKEND_DOMAINS[BackendType.OPF]);
  });

  it("should set the correct User-Agent header based on platform", () => {
    const backends = [
      BackendType.OFF,
      BackendType.OBF,
      BackendType.OPFF,
      BackendType.OPF,
    ];

    const expectedAgentPrefixes = [
      BACKEND_NAMES[BackendType.OFF],
      BACKEND_NAMES[BackendType.OBF],
      BACKEND_NAMES[BackendType.OPFF],
      BACKEND_NAMES[BackendType.OPF],
    ];

    for (let i = 0; i < backends.length; i++) {
      const off = new OpenFoodFacts(dummyFetch, {
        type: backends[i],
      });

      // @ts-ignore - accessing private property for testing
      expect(off.customUserAgent).toContain(expectedAgentPrefixes[i]);
    }
  });

  it("should accept a custom host", () => {
    const customHost = "https://test.openfoodfacts.org";
    const off = new OpenFoodFacts(dummyFetch, {
      type: BackendType.OFF,
      host: customHost,
    });

    // @ts-ignore - accessing private property for testing
    expect(off.baseUrl).toBe(customHost);
  });
});
