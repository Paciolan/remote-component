import { RemoteComponent } from "../RemoteComponent";

describe("components/RemoteComponent", () => {
  test("is function", () => {
    const actual = RemoteComponent;
    const expected = Function;
    expect(actual).toBeInstanceOf(expected);
  });
});
