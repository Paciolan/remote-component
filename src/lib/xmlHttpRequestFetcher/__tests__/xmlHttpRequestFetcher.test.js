import xmlHttpRequestFetcher from "..";
import { OPENED, UNSENT, DONE } from "../readyState";
import { OK, InternalServerError } from "../status";

describe("lib/xmlHttpRequestFetcher", () => {
  const originalXmlHttpRequest = window.XMLHttpRequest;

  let mockXhrRequest;

  const mockXhr = {
    open: jest.fn().mockImplementation((...args) => (mockXhrRequest = args)),
    send: jest.fn().mockImplementation(() => {
      const isValid = mockXhrRequest[1] === "http://valid.url";

      mockXhr.readyState = OPENED;
      mockXhr.onreadystatechange();

      mockXhr.readyState = DONE;
      mockXhr.status = isValid ? OK : InternalServerError;
      mockXhr.responseText = isValid ? "SUCCESS" : "";
      mockXhr.statusText = isValid ? "OK" : "Internal Server Error";
      mockXhr.onreadystatechange();
    }),
    readyState: UNSENT
  };

  beforeAll(() => {
    global.XMLHttpRequest = jest.fn(() => mockXhr);
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
    const expected = "500 Internal Server Error";
    const actual = xmlHttpRequestFetcher("http://invalid.url");
    return expect(actual).rejects.toBe(expected);
  });
});
