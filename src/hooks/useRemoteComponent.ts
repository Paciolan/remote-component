import { useEffect, useState, useRef } from "react";
import createLoadRemoteModule from "@paciolan/remote-module-loader";

export interface UseRemoteComponentHook {
  (url: string): [boolean, Error, (...unknown) => JSX.Element];
}

export const createUseRemoteComponent = (
  args?: unknown
): UseRemoteComponentHook => {
  const loadRemoteModule = createLoadRemoteModule(args);

  const useRemoteComponent: UseRemoteComponentHook = url => {
    const [{ loading, err, component }, setState] = useState({
      loading: true,
      err: undefined,
      component: undefined
    });
    const latestUrl = useRef(url);

    useEffect(() => {
      let update = setState;
      update({ loading: true, err: undefined, component: undefined });
      latestUrl.current = url;
      loadRemoteModule(url)
        .then(module =>
          update({ loading: false, err: undefined, component: module.default })
        )
        .catch(err => update({ loading: false, err, component: undefined }));

      return () => {
        // invalidate update function for stale closures
        update = () => {
          // this function is left intentionally blank
        };
      };
    }, [url]);
    if (latestUrl.current !== url) {
      return [true, undefined, undefined];
    }
    return [loading, err, component];
  };

  return useRemoteComponent;
};
