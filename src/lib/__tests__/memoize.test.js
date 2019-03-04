import memoize from "../memoize";

describe("lib/memoize", () => {
  test("memoizes same argument", () => {
    const upper = jest.fn().mockImplementation(s => s.toUpperCase());
    const memoized = memoize(upper);
    memoized("abc");
    memoized("abc");
    expect(upper).toBeCalledTimes(1);
  });

  test("does not memoizes different argument", () => {
    const upper = jest.fn().mockImplementation(s => s.toUpperCase());
    const memoized = memoize(upper);
    memoized("abc");
    const actual = memoized("xyz");
    expect(actual).toBe("XYZ");
  });
});
