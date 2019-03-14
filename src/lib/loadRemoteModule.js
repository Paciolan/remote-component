import memoize from "./memoize";
import xmlHttpRequestFetcher from "./xmlHttpRequestFetcher";

const defaultRequires = name => {
  throw new Error(
    `Could not require '${name}'. The 'requires' function was not provided.`
  );
};

export const createLoadRemoteModule = ({
  requires = defaultRequires,
  fetcher = xmlHttpRequestFetcher
} = {}) =>
  memoize(url =>
    fetcher(url).then(data => {
      const exports = {};
      new Function("require", "exports", data)(requires, exports);
      return exports;
    })
  );
