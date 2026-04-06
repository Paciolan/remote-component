import { renderHook, waitFor } from "@testing-library/react";
import { createUseRemoteComponent } from "../useRemoteComponent";

describe("effects/useRemoteComponent", () => {
  const validModule =
    'Object.assign(exports, { default: "SUCCESS!", named: "ALSO SUCCESS!" })';

  const mockFetcher = url =>
    url === "http://valid.url"
      ? new Promise(resolve => {
          setTimeout(() => resolve(validModule), 200);
        })
      : new Promise((_, reject) => {
          setTimeout(
            () => reject(SyntaxError("Invalid or unexpected token")),
            100
          );
        });

  const useRemoteComponent = createUseRemoteComponent({
    fetcher: mockFetcher
  });

  test("Sets loading state on initial", async () => {
    const expected = [true, undefined, undefined];
    const { result } = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://valid.url"
    });
    expect(result.current).toStrictEqual(expected);
  });

  test("Sets component state when success", async () => {
    const expected = [false, undefined, "SUCCESS!"];
    const { result } = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://valid.url"
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual(expected);
    });
  });

  test("Sets err state when failure", async () => {
    const expected = [
      false,
      SyntaxError("Invalid or unexpected token"),
      undefined
    ];
    const { result } = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://invalid.url"
    });
    await waitFor(() => {
      expect(result.current).toStrictEqual(expected);
    });
  });

  test("Unmount prevents update state", async () => {
    const expected = [false, undefined, "SUCCESS!"];
    const { result, rerender } = renderHook(
      (...props) => useRemoteComponent(...props),
      {
        initialProps: "http://invalid.url"
      }
    );
    rerender("http://valid.url");
    await waitFor(() => {
      expect(result.current).toStrictEqual(expected);
    });
  });

  test("Sets component state when success with named imports", async () => {
    const expected = [false, undefined, "ALSO SUCCESS!"];
    const { result } = renderHook(() =>
      useRemoteComponent("http://valid.url", "named")
    );
    await waitFor(() => {
      expect(result.current).toStrictEqual(expected);
    });
  });
});
