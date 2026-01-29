import { Robotoff } from "../src";

describe("Robotoff", () => {

    const robotoff = new Robotoff(fetch as any);
    let testLogoId: number;
    it("searches logo crops", async () => {
 
        const res = await robotoff.searchLogos({
          barcode: "5410041040807",
          count: 2,
        });
 
        expect(res.data).toBeDefined();
        expect(res.data?.logos).toBeDefined();
        expect(res.data!.logos.length).toBeGreaterThan(0);
        testLogoId = res.data!.logos[0].id as number;
    });
    it("annotates a logo", async () => {
        const annotations: {
            logo_id: number;
            type: "brand" | "category" | "label" | "no_logo" | "nutritional_label" | "packager_code" | "packaging" | "qr_code" | "store";
            value: string | null;
            server_type?: "off" | "obf" | "opff" | "opf" | "off_pro";
          }[] = [
            {
              logo_id: testLogoId,
              type: "brand",
              value: "test-brand",
              server_type: "off",
            },
        ];

        const res = await robotoff.annotateLogos(annotations);
        expect(res).toBeDefined();
    });


    it("gets logo annotations", async () => {
        const res = await robotoff.getLogoAnnotations(testLogoId);

        expect(res.data).toBeDefined();
        expect(Array.isArray(res.data?.annotations || [])).toBe(true);
    
    }, 15000);

    it("resets a logo", async () => {
        const res = await robotoff.resetLogo(testLogoId);
    
        expect(res).toBeDefined();
    });

});