/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchRemoteComponent } from "../fetchRemoteComponent";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

jest.mock("@paciolan/remote-module-loader", () => () => async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const defaultComponent = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const alternateComponent = () => {};
  (alternateComponent as any).getServerSideProps = () => {
    return { abc: 123 };
  };

  return {
    default: defaultComponent,
    alternate: alternateComponent
  };
});

describe("fetchRemoteComponent", () => {
  test("returns default component", async () => {
    expect.assertions(1);
    const url = "http://fake.url/component.js";
    const requires = noop;

    const Component = await fetchRemoteComponent({ url, requires });
    const expected = "defaultComponent";
    expect(Component.name).toBe(expected);
  });

  test("returns alternate component", async () => {
    expect.assertions(1);
    const url = "http://fake.url/component.js";
    const requires = noop;
    const imports = "alternate";

    const Component = await fetchRemoteComponent({ url, requires, imports });
    const expected = "alternateComponent";
    expect(Component.name).toBe(expected);
  });

  test("returns alternate component", () => {
    expect.assertions(1);
    const url = "http://fake.url/component.js";
    const requires = noop;
    const imports = "invalid";

    const actual = fetchRemoteComponent({ url, requires, imports });
    const expected = new Error(
      "Could not load 'invalid' from 'http://fake.url/component.js'."
    );
    return expect(actual).rejects.toStrictEqual(expected);
  });
});
