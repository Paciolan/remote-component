/**
 * NOTE: This is the OLD style testing where we are mocking react (BAD)
 *       Look at useRemoteComponent2.test.js for the new style.
 */
import { createUseRemoteComponent } from "../useRemoteComponent";
import React from "react";

jest.mock("react", () => ({
  useEffect: jest.fn(f => f())
}));

const waitNextFrame = () => new Promise(resolve => setTimeout(resolve));

describe("effects/useRemoteComponent", () => {
  const invalidModule = "'";
  const validModule = 'Object.assign(exports, { default: "SUCCESS!" })';

  let state = undefined;

  beforeAll(() => {
    state = undefined;
    React.useState = jest
      .fn()
      .mockImplementation(s => [state || s, s => (state = s)]);
  });

  const mockFetcher = url =>
    url === "http://valid.url"
      ? Promise.resolve(validModule)
      : Promise.resolve(invalidModule);

  test("Sets loading state on initial", async () => {
    const expected = [true, undefined, undefined];
    const useRemoteComponent = createUseRemoteComponent({
      fetcher: mockFetcher
    });
    const actual = useRemoteComponent("http://valid.url");
    expect(actual).toMatchObject(expected);
  });

  test("Sets component state when success", async () => {
    const expected = [false, undefined, "SUCCESS!"];
    const useRemoteComponent = createUseRemoteComponent({
      fetcher: mockFetcher
    });
    useRemoteComponent("http://valid.url");
    await waitNextFrame();
    const actual = useRemoteComponent("http://valid.url");
    expect(actual).toMatchObject(expected);
  });

  test("Sets err state when failure", async () => {
    const expected = [
      false,
      SyntaxError("Invalid or unexpected token"),
      undefined
    ];
    const useRemoteComponent = createUseRemoteComponent({
      fetcher: mockFetcher
    });
    useRemoteComponent("http://invalid.url");
    await waitNextFrame();
    const actual = useRemoteComponent("http://invalid.url");
    expect(actual).toMatchObject(expected);
  });
});
