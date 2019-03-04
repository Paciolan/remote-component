import axios from "axios";
import memoize from "./memoize";

const defaultFetcher = url => axios.get(url).then(response => response.data);

export const createLoadRemoteModule = ({
  requires,
  fetcher = defaultFetcher
} = {}) =>
  memoize(url =>
    fetcher(url).then(data => {
      const exports = {};
      new Function("require", "exports", data)(requires, exports);
      return exports;
    })
  );
