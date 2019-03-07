import axios from "axios";
import memoize from "./memoize";

const defaultFetcher = url => axios.get(url).then(response => response.data);
const defaultRequires = name => {
  throw new Error(
    `Could not require '${name}'. The 'requires' function was not provided.`
  );
};

export const createLoadRemoteModule = ({
  requires = defaultRequires,
  fetcher = defaultFetcher
} = {}) =>
  memoize(url =>
    fetcher(url).then(data => {
      const exports = {};
      new Function("require", "exports", data)(requires, exports);
      return exports;
    })
  );
