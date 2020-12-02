import { fetchRemoteComponent } from "../fetchRemoteComponent";

jest.mock("@paciolan/remote-module-loader", () => () => async () => {
  const defaultComponent = () => {};
  const alternateComponent = () => {};
  alternateComponent.getServerSideProps = () => {
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
    const requires = () => {};

    const Component = await fetchRemoteComponent({ url, requires });
    const expected = "defaultComponent";
    expect(Component.name).toBe(expected);
  });

  test("returns alternate component", async () => {
    expect.assertions(1);
    const url = "http://fake.url/component.js";
    const requires = () => {};
    const imports = "alternate";

    const Component = await fetchRemoteComponent({ url, requires, imports });
    const expected = "alternateComponent";
    expect(Component.name).toBe(expected);
  });

  test("returns alternate component", () => {
    expect.assertions(1);
    const url = "http://fake.url/component.js";
    const requires = () => {};
    const imports = "invalid";

    const actual = fetchRemoteComponent({ url, requires, imports });
    const expected = new Error(
      "Could not load 'invalid' from 'http://fake.url/component.js'."
    );
    return expect(actual).rejects.toStrictEqual(expected);
  });
});
