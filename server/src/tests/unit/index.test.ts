import { describe, expect, it } from "@jest/globals";
import { addition } from "../../utils/uselessFunctionsToTest";

describe("addition function", () => {
  it("should return the sum of two positive numbers", () => {
    expect(addition(2, 3)).toBe(5);
  });

  it("should return the sum of a negative and a positive number", () => {
    expect(addition(-1, 1)).toBe(0);
  });

  it("should return zero when adding two zeros", () => {
    expect(addition(0, 0)).toBe(0);
  });

  it("should return the sum of two negative numbers", () => {
    expect(addition(-5, -5)).toBe(-10);
  });
});
