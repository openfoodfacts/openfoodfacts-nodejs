import { formBody } from "../src/formbody";

describe(formBody, () => {
  it("should correctly handle strings", () => {
    const obj1 = { param1: "value1" };
    expect(decodeURIComponent(formBody(obj1))).toBe("param1=value1");
    const obj2 = { param1: "value1", param2: "value2" };
    expect(decodeURIComponent(formBody(obj2))).toBe(
      "param1=value1&param2=value2",
    );
  });

  it("should correctly handle numbers", () => {
    const obj1 = { param1: 1 };
    expect(decodeURIComponent(formBody(obj1))).toBe("param1=1");
    const obj2 = { param1: "value1", param2: 2 };
    expect(decodeURIComponent(formBody(obj2))).toBe("param1=value1&param2=2");
  });

  it("should correctly handle booleans", () => {
    const obj1 = { param1: true };
    expect(decodeURIComponent(formBody(obj1))).toBe("param1=true");
  });

  it("should correctly handle objects", () => {
    const obj1 = { param1: { nestedParam1: "nestedvalue1" } };
    expect(decodeURIComponent(formBody(obj1))).toBe(
      `param1={"nestedParam1":"nestedvalue1"}`,
    );
    const obj2 = { param1: { nestedParam1: "nestedvalue1" }, param2: 2 };
    expect(decodeURIComponent(formBody(obj2))).toBe(
      `param1={"nestedParam1":"nestedvalue1"}&param2=2`,
    );
  });

  it("should correctly handle bigints", () => {
    const obj = { param1: BigInt(1) };
    expect(decodeURIComponent(formBody(obj))).toBe(`param1=1`);
  });

  it("should error on functions", () => {
    const obj = { param1: () => "param1" };
    expect(() => formBody(obj)).toThrow("Cannot formBody-fy a function");
  });

  it("should error on symbols", () => {
    const obj = { param1: Symbol("value") };
    expect(() => formBody(obj)).toThrow("Cannot formBody-fy a symbol");
  });

  it("should ignore null", () => {
    const obj = { param1: "value1", param2: null };
    expect(decodeURIComponent(formBody(obj))).toBe("param1=value1");
  });

  it("should ignore undefined", () => {
    const obj = { param1: "value1", param2: undefined };
    expect(decodeURIComponent(formBody(obj))).toBe("param1=value1");
  });
});
