/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSideProps } from "../getServerSideProps";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

jest.mock("@paciolan/remote-module-loader", () => () => async url => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const componentNoProps = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const componentWithProps = () => {};
  (componentWithProps as any).getServerSideProps = () => {
    return { abc: 123 };
  };

  return {
    default:
      url === "http://fake.url/yes-props.js"
        ? componentWithProps
        : componentNoProps
  };
});

describe("getServerSideProps", () => {
  test("no getServerSideProps returns {}", async () => {
    expect.assertions(1);
    const url = "http://fake.url/no-props.js";
    const requires = noop;
    const context = {};
    const props = await getServerSideProps({ url, requires, context });

    const expected = {};
    expect(props).toStrictEqual(expected);
  });

  test("with getServerSideProps returns { abc: 123 }", async () => {
    expect.assertions(1);
    const url = "http://fake.url/yes-props.js";
    const requires = noop;
    const context = {};
    const props = await getServerSideProps({ url, requires, context });

    const expected = { abc: 123 };
    expect(props).toStrictEqual(expected);
  });
});
