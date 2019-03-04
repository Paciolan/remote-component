import { createLoadRemoteModule } from "../loadRemoteModule";
import axios from "axios";

jest.mock("axios", () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve({ data: "" }))
}));

describe("lib/loadRemoteModule", () => {
  const invalidModule = "'";
  const validModule = 'Object.assign(exports, { default: () => "SUCCESS!" })';

  const mockFetcher = url =>
    url === "http://valid.url"
      ? Promise.resolve(validModule)
      : Promise.resolve(invalidModule);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("invalid module rejects", () => {
    const expected = SyntaxError("Invalid or unexpected token");
    const loadRemoteModule = createLoadRemoteModule({ fetcher: mockFetcher });
    const actual = loadRemoteModule("http://fake.url");
    return expect(actual).rejects.toMatchObject(expected);
  });

  test("valid module resolves", async () => {
    const expected = ["default"];
    const loadRemoteModule = createLoadRemoteModule({ fetcher: mockFetcher });
    const module = await loadRemoteModule("http://valid.url");
    const actual = Object.keys(module);
    return expect(actual).toMatchObject(expected);
  });

  test("valid module executes", async () => {
    const expected = "SUCCESS!";
    const loadRemoteModule = createLoadRemoteModule({ fetcher: mockFetcher });
    const module = await loadRemoteModule("http://valid.url");
    const actual = module.default();
    return expect(actual).toBe(expected);
  });

  test("fetcher defaults to axios", async () => {
    const expected = "http://valid.url";
    const loadRemoteModule = createLoadRemoteModule();
    await loadRemoteModule(expected);
    expect(axios.get).toBeCalledWith(expected);
    expect(axios.get).toBeCalledTimes(1);
  });
});
