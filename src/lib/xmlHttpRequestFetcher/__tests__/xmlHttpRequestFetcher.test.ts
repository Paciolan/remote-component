import xmlHttpRequestFetcher from "..";
import { OPENED, UNSENT, DONE } from "../readyState";
import { OK, InternalServerError } from "../../status";

describe("lib/xmlHttpRequestFetcher", () => {
  const originalXmlHttpRequest = (global as any).XMLHttpRequest;

  let mockXhrRequest;

  const mockXhr = {
    open: jest.fn().mockImplementation((...args) => (mockXhrRequest = args)),
    send: jest.fn().mockImplementation(() => {
      const isValid = mockXhrRequest[1] === "http://valid.url";

      mockXhr.readyState = OPENED;
      (<any>mockXhr).onreadystatechange();

      mockXhr.readyState = DONE;
      (<any>mockXhr).status = isValid ? OK : InternalServerError;
      (<any>mockXhr).responseText = isValid ? "SUCCESS" : "";
      (<any>mockXhr).statusText = isValid ? "OK" : "Internal Server Error";
      (<any>mockXhr).onreadystatechange();
    }),
    readyState: UNSENT
  };

  beforeAll(() => {
    (<any>global).XMLHttpRequest = jest.fn(() => mockXhr);
  });

  afterAll(() => {
    global.XMLHttpRequest = originalXmlHttpRequest;
  });

  test("valid request resolves", async () => {
    const expected = "SUCCESS";
    const actual = await xmlHttpRequestFetcher("http://valid.url");
    expect(actual).toBe(expected);
  });

  test("invalid request rejects", () => {
    const expected = new Error('HTTP Error Response: 500 Internal Server Error (http://invalid.url)');
    const actual = xmlHttpRequestFetcher("http://invalid.url");
    return expect(actual).rejects.toStrictEqual(expected);
  });
});
