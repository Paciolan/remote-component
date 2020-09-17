/**
 * NOTE: This is the NEW style testing using @testing-library/react-hooks
 *       The old style is in useRemoteComponent.test.js
 */
import { renderHook } from "@testing-library/react-hooks";
import { createUseRemoteComponent } from "../useRemoteComponent";

describe("effects/useRemoteComponent", () => {
  const invalidModule = "'";
  const validModule = 'Object.assign(exports, { default: "SUCCESS!" })';

  const mockFetcher = url =>
    url === "http://valid.url"
      ? new Promise(resolve => {
          setTimeout(() => resolve(validModule), 200);
        })
      : new Promise((_, reject) => {
          setTimeout(() => reject(invalidModule), 100);
        });

  const useRemoteComponent = createUseRemoteComponent({
    fetcher: mockFetcher
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
});
