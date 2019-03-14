import { createLoadRemoteModule } from "../loadRemoteModule";
import xmlHttpRequestFetcher from "../xmlHttpRequestFetcher";

const invalidModule = "'";
const validModule = 'Object.assign(exports, { default: () => "SUCCESS!" })';
const requiresModules =
  'Object.assign(exports, { default: () => require("test") })';

const mockFetcher = url =>
    url === "http://valid.url" ? Promise.resolve(validModule)
    : url === "http://requires.url" ? Promise.resolve(requiresModules)
    : Promise.resolve(invalidModule); // prettier-ignore

jest.mock("../xmlHttpRequestFetcher", () =>
  jest.fn().mockImplementation(url => mockFetcher(url))
);

describe("lib/loadRemoteModule", () => {
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

  test("fetcher defaults to xmlHttpRequestFetcher", async () => {
    const expected = "http://valid.url";
    const loadRemoteModule = createLoadRemoteModule();
    await loadRemoteModule(expected);
    expect(xmlHttpRequestFetcher).toBeCalledWith(expected);
    expect(xmlHttpRequestFetcher).toBeCalledTimes(1);
  });

  test("requires defaults to error", async () => {
    const expected = Error(
      "Could not require 'test'. The 'requires' function was not provided."
    );
    const loadRemoteModule = createLoadRemoteModule({ fetcher: mockFetcher });
    const module = await loadRemoteModule("http://requires.url");
    const actual = () => module.default();
    expect(actual).toThrowError(expected);
  });
});
