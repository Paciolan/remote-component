import React, { useEffect, useState } from "react";
import createLoadRemoteModule from "@paciolan/remote-module-loader";

export interface UseRemoteComponentHook {
  (
    url: string,
    imports?: string
  ): [
    boolean,
    Error | undefined,
    ((...args: unknown[]) => React.JSX.Element) | undefined
  ];
}

export const createUseRemoteComponent = (
  args?: Parameters<typeof createLoadRemoteModule>[0]
): UseRemoteComponentHook => {
  const loadRemoteModule = createLoadRemoteModule(args);

  const useRemoteComponent: UseRemoteComponentHook = (
    url,
    imports = "default"
  ) => {
    const [{ loading, err, component }, setState] = useState({
      loading: true,
      err: undefined,
      component: undefined
    });

    useEffect(() => {
      let update = setState;

      update({ loading: true, err: undefined, component: undefined });

      loadRemoteModule(url)
        .then(module =>
          update({ loading: false, err: undefined, component: module[imports] })
        )
        .catch(err => update({ loading: false, err, component: undefined }));

      return () => {
        // invalidate update function for stale closures
        update = () => {
          // this function is left intentionally blank
        };
      };
    }, [url]);

    return [loading, err, component];
  };

  return useRemoteComponent;
};
