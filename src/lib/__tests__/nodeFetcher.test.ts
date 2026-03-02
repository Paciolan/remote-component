import nodeFetcher from "../nodeFetcher";
import { OK, InternalServerError } from "../status";

// node: http and https mocks are duplicated
jest.mock("http", () => {
  return {
    get: jest.fn((url, callback) => {
      let onErrorCallback;
      const isPrematureClose = url === "http://premature-close.url";

      const res = {
        on: jest.fn((eventName, fn) => {
          if (url === "http://invalid.url" && onErrorCallback) {
            const error = new Error("500 Internal Server Error");
            (<any>error).response = res;
            onErrorCallback(error);
            return res;
          }
          if (eventName === "data") {
            if (isPrematureClose) {
              fn("PAR");
            } else {
              fn("SUCC");
              fn("ESS");
            }
          } else if (eventName === "end") {
            if (!isPrematureClose) {
              fn();
            }
          } else if (eventName === "close") {
            if (isPrematureClose) {
              fn();
            }
          }

          return res;
        }),
        statusCode: url === "http://invalid.url" ? InternalServerError : OK,
        statusMessage: url === "http://invalid.url" ? "Internal Server Error" : "OK",
        complete: !isPrematureClose
      };
      setTimeout(() => callback(res), 0);
      return {
        on: jest.fn((eventName, callback) => {
          if (eventName === "error") {
            onErrorCallback = callback;
          }
        })
      };
    })
  };
});

// node: http and https mocks are duplicated
jest.mock("https", () => {
  return {
    get: jest.fn((url, callback) => {
      let onErrorCallback;

      const res = {
        on: jest.fn((eventName, fn) => {
          if (url === "https://invalid.url" && onErrorCallback) {
            onErrorCallback(new Error("500 Internal Server Error"));
            return res;
          }
          if (eventName === "data") {
            // send SUCCESS as 2 packets
            fn("SUCC");
            fn("ESS");
          } else if (eventName === "end") {
            fn();
          }
          return res;
        }),
        statusCode: url === "http://invalid.url" ? InternalServerError: OK,
        statusMessage: url === "http://invalid.url" ? "Internal Server Error": "OK"
      };
      setTimeout(() => callback(res), 0);
      return {
        on: jest.fn((eventName, callback) => {
          if (eventName === "error") {
            onErrorCallback = callback;
          }
        })
      };
    })
  };
});

describe("lib/nodeFetcher", () => {
  test("invalid URL rejects", () => {
    expect.assertions(1);
    const expected = new Error("URL must be a string.");
    const actual = nodeFetcher(null);
    return expect(actual).rejects.toStrictEqual(expected);
  });

  test("valid http request resolves", async () => {
    expect.assertions(1);
    const expected = "SUCCESS";
    const actual = await nodeFetcher("http://valid.url");
    expect(actual).toBe(expected);
  });

  test("valid https request resolves", async () => {
    expect.assertions(1);
    const expected = "SUCCESS";
    const actual = await nodeFetcher("https://valid.url");
    expect(actual).toBe(expected);
  });

  test("invalid request rejects", () => {
    expect.assertions(1);
    const expected = new Error("HTTP Error Response: 500 Internal Server Error (http://invalid.url)");
    const actual = nodeFetcher("http://invalid.url");
    return expect(actual).rejects.toStrictEqual(expected);
  });

  test("premature close rejects", () => {
    expect.assertions(1);
    const expected = new Error(
      "Connection closed before response was complete (http://premature-close.url)"
    );
    const actual = nodeFetcher("http://premature-close.url");
    return expect(actual).rejects.toStrictEqual(expected);
  }, 2000);
});
