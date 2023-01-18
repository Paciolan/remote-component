import { renderHook } from "@testing-library/react-hooks";
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
    const all = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://valid.url"
    });
    const { result } = all;
    expect(result.current).toStrictEqual(expected);
  });

  test("Sets component state when success", async () => {
    const expected = [false, undefined, "SUCCESS!"];
    const all = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://valid.url"
    });
    const { waitForNextUpdate, result } = all;
    await waitForNextUpdate();
    expect(result.current).toStrictEqual(expected);
  });

  test("Sets err state when failure", async () => {
    const expected = [
      false,
      SyntaxError("Invalid or unexpected token"),
      undefined
    ];
    const all = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://invalid.url"
    });
    const { waitForNextUpdate, result } = all;
    await waitForNextUpdate();
    expect(result.current).toStrictEqual(expected);
  });

  test("Unmount prevents update state", async () => {
    const expected = [false, undefined, "SUCCESS!"];
    const all = renderHook((...props) => useRemoteComponent(...props), {
      initialProps: "http://invalid.url"
    });
    const { rerender, waitForNextUpdate, result } = all;
    rerender("http://valid.url");
    await waitForNextUpdate();

    expect(result.current).toStrictEqual(expected);
  });

  test("Sets component state when success with named imports", async () => {
    const expected = [false, undefined, "ALSO SUCCESS!"];
    const all = renderHook(() =>
      useRemoteComponent("http://valid.url", "named")
    );
    const { waitForNextUpdate, result } = all;
    await waitForNextUpdate();

    expect(result.current).toStrictEqual(expected);
  });
});
