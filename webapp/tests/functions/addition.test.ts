import { expect, test } from "vitest";
import { addition } from "../../src/lib/utils/uselessFunctionsToTest";

test("addition function", () => {
  expect(addition(2, 3)).toBe(5);
  expect(addition(-1, 1)).toBe(0);
  expect(addition(0, 0)).toBe(0);
  expect(addition(-5, -5)).toBe(-10);
});
