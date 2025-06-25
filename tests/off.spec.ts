import { getProductImageFolder } from "../src/main";
import { PRODUCT_IMAGE_BASE_URL } from "../src/consts";

describe("getProductImageFolder", () => {
  it("should construct the correct folder path from barcode", () => {
    const barcode = "6111035000430";
    const expected = `${PRODUCT_IMAGE_BASE_URL}/611/103/500/0430/`;
    expect(getProductImageFolder(barcode)).toBe(expected);
  });
});
