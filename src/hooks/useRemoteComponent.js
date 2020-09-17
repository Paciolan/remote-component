import { useEffect, useState } from "react";
import createLoadRemoteModule from "@paciolan/remote-module-loader";

export const createUseRemoteComponent = args => {
  const loadRemoteModule = createLoadRemoteModule(args);

  const useRemoteComponent = url => {
    const [{ loading, err, component }, setState] = useState({ loading: true });

    useEffect(() => {
      let update = setState;
      update({ loading: true });
      loadRemoteModule(url)
        .then(module => update({ loading: false, component: module.default }))
        .catch(err => update({ loading: false, err }));

      return () => {
        // invalidate update function for stale closures
        update = () => {};
      };
    }, [url]);

    return [loading, err, component];
  };

  return useRemoteComponent;
};
