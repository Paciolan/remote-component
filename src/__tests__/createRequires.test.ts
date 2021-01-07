/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequires } from "../createRequires";

describe("lib/createRequires", () => {
  test("requires dependency", () => {
    const requires = createRequires({ abc: 123 });
    const actual = requires("abc");
    const expected = 123;
    expect(actual).toBe(expected);
  });

  test("missing dependency throws", () => {
    const requires = createRequires({ abc: 123 });
    const actual = () => requires("xyz");
    const expected = "Could not require 'xyz'. 'xyz' does not exist in dependencies."; // prettier-ignore
    expect(actual).toThrow(expected);
  });

  test("missing dependency () throws", () => {
    const requires = createRequires();
    const actual = () => requires("xyz");
    const expected = "Could not require 'xyz'. 'xyz' does not exist in dependencies."; // prettier-ignore
    expect(actual).toThrow(expected);
  });

  test("missing dependency (undefined) throws", () => {
    const requires = createRequires(undefined);
    const actual = () => requires("xyz");
    const expected = "Could not require 'xyz'. 'xyz' does not exist in dependencies."; // prettier-ignore
    expect(actual).toThrow(expected);
  });

  test("missing dependency (null) throws", () => {
    const requires = createRequires(null);
    const actual = () => requires("xyz");
    const expected = "Could not require 'xyz'. 'xyz' does not exist in dependencies."; // prettier-ignore
    expect(actual).toThrow(expected);
  });

  test("resolves lazy dependency", () => {
    const expected = "SUCCESS";
    const requires = createRequires((() => ({
      xyz: expected
    })) as any);
    const actual = requires("xyz");
    expect(actual).toBe(expected);
  });

  test("lazy resolves is lazy", () => {
    const expected = 0;
    const actual = jest.fn();
    createRequires(actual as any);
    expect(actual).toHaveBeenCalledTimes(expected);
  });

  test("lazy resolves calls once", () => {
    const expected = 1;
    const actual = jest.fn(() => ({
      xyz: "success"
    }));
    const requires = createRequires(actual as any);
    requires("xyz");
    requires("xyz");
    expect(actual).toHaveBeenCalledTimes(expected);
  });
});
