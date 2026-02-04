import { LogoAnnotation, Robotoff } from "../src";
import { TestUtils } from "./utils/test-utils";
describe("Robotoff", () => {
  let fetchMock: jest.Mock;
  let robotoff: Robotoff;
  let testLogoId = 12345;
  const mockResponse = TestUtils.mockResponse;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock as any;
    robotoff = new Robotoff(fetchMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it("searches logo crops", async () => {
    const mockData = { logos: [{ id: testLogoId }], count: 1 };
    fetchMock.mockResolvedValue(mockResponse(mockData));

    const res = await robotoff.searchLogos({
      barcode: "5410041040807",
      count: 2,
    });
    expect(res.data).toBeDefined();
    expect(res.data?.logos).toBeDefined();
    expect(res.data!.logos.length).toBeGreaterThan(0);
    expect(res.data!.logos[0].id).toBe(testLogoId);
  });
  it("annotates a logo", async () => {
    const annotations: LogoAnnotation[] = [
      {
        logo_id: testLogoId,
        type: "brand",
        value: "test-brand",
        server_type: "off",
      },
    ];

    const mockData = { annotated: 1 };
    fetchMock.mockResolvedValue(mockResponse(mockData));

    const res = await robotoff.annotateLogos(annotations);

    expect(res.data).toBeDefined();
    expect(res.data?.annotated).toBeGreaterThan(0);
  });

  it("gets logo annotations", async () => {
    const mockData = {
      annotations: [
        { logo_id: testLogoId, type: "brand", value: "test-brand" },
      ],
    };
    fetchMock.mockResolvedValue(mockResponse(mockData));

    const res = await robotoff.getLogoAnnotations(testLogoId);

    expect(res.data).toBeDefined();
    expect(Array.isArray(res.data?.annotations)).toBe(true);
    expect(res.data!.annotations.length).toBe(1);

    expect(res.data!.annotations[0]).toEqual({
      logo_id: testLogoId,
      type: "brand",
      value: "test-brand",
    });

  }, 15000);

  it("resets a logo", async () => {
    fetchMock.mockResolvedValue(mockResponse(null, true, 204));

    const res = await robotoff.resetLogo(testLogoId);

    expect(res.error).toBeUndefined();
    expect(res.data).toBeUndefined();
  
  });
});
