import { Fetcher } from "../models";
import memoize from "./memoize";
import nodeFetcher from "./nodeFetcher";
import xmlHttpRequestFetcher from "./xmlHttpRequestFetcher/index";

/* istanbul ignore next - environment detection */
const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

/* istanbul ignore next - difficult to test */
const defaultFetcher = isBrowser ? xmlHttpRequestFetcher : nodeFetcher;

const defaultRequires = name => {
  throw new Error(
    `Could not require '${name}'. The 'requires' function was not provided.`
  );
};

export interface CreateLoadRemoteModuleOptions {
  requires?: any;
  fetcher?: Fetcher;
}

interface LoadRemoteModule {
  (url: string): Promise<any>;
}

interface CreateLoadRemoteModule {
  (options?: CreateLoadRemoteModuleOptions): LoadRemoteModule;
}

export const createLoadRemoteModule: CreateLoadRemoteModule = ({
  requires,
  fetcher
} = {}) => {
  const _requires = requires || defaultRequires;
  const _fetcher = fetcher || defaultFetcher;

  return memoize(url =>
    _fetcher(url).then(data => {
      const exports = {};
      const module = { exports };
      const func = new Function("require", "module", "exports", data);
      func(_requires, module, exports);
      return module.exports;
    })
  );
};
