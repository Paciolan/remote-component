import * as fs from "fs";
import { createLoadRemoteModule } from "../loadRemoteModule";
import xmlHttpRequestFetcher from "../xmlHttpRequestFetcher";

const invalidModule = "'";
const validModule = 'Object.assign(exports, { default: () => "SUCCESS!" })';
const namedExportsModule =
  'Object.assign(exports, {\n' +
  '  delete: () => "DELETED",\n' +
  '  create: () => "CREATED",\n' +
  '  update: () => "UPDATED",\n' +
  '  list: () => [],\n' +
  '})';
const umdModule = fs.readFileSync(
  __dirname + "/h-document-element.umd",
  "utf8"
);
const requiresModules =
  'Object.assign(exports, { default: () => require("test") })';

const mockFetcher = url =>
    url === "http://valid.url" ? Promise.resolve(validModule)
    : url === "http://requires.url" ? Promise.resolve(requiresModules)
    : url === "http://umdmodule.url" ? Promise.resolve(umdModule)
    : url === "http://namedexports.url" ? Promise.resolve(namedExportsModule)
    : Promise.resolve(invalidModule); // prettier-ignore

jest.mock("../xmlHttpRequestFetcher", () => {
  // Set window before loadRemoteModule.ts evaluates isBrowser so
  // xmlHttpRequestFetcher is selected as the default fetcher.
  (global as any).window = { document: {} };
  return { default: jest.fn().mockImplementation(url => mockFetcher(url)) };
});

describe("lib/loadRemoteModule", () => {
  afterAll(() => {
    delete (global as any).window;
  });

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

  test("umd load", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://umdmodule.url");
    expect(result.Fragment).toBeDefined();
    expect(result.createElement).toBeDefined();
    expect(result.h).toBeDefined();
  });

  test("load functions using named exports", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://namedexports.url");
    expect(result.create).toBeDefined();
    expect(result.delete).toBeDefined();
    expect(result.update).toBeDefined();
    expect(result.list).toBeDefined();
  });

  test("return string from create named exports function", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://namedexports.url");
    const expected = "CREATED";
    const actual = result.create();
    expect(actual).toBe(expected);
  });

  test("return array from named exports function", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://namedexports.url");
    const expected = [];
    const actual = result.list();
    expect(actual).toMatchObject(expected);
  });

  test("return string from delete named exports function", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://namedexports.url");
    const expected = "DELETED";
    const actual = result.delete();
    expect(actual).toBe(expected);
  });

  test("return string from update named exports function", async () => {
    const remoteModuleLoader = createLoadRemoteModule();
    const result = await remoteModuleLoader("http://namedexports.url");
    const expected = "UPDATED";
    const actual = result.update();
    expect(actual).toBe(expected);
  });
});
