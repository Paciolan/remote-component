import { RemoteComponent } from "../RemoteComponent";
import { getDependencies } from "../../getDependencies";

jest.mock("../../getDependencies", () => ({
  getDependencies: jest.fn()
}));

describe("components/RemoteComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getDependencies is lazy", () => {
    expect(getDependencies).toBeCalledTimes(0);
  });

  test("is function", () => {
    const actual = RemoteComponent;
    const expected = Function;
    expect(actual).toBeInstanceOf(expected);
  });
});
