import { useEffect, useState } from "react";
import createLoadRemoteModule from "@paciolan/remote-module-loader";

export const createUseRemoteComponent = args => {
  const loadRemoteModule = createLoadRemoteModule(args);

  const useRemoteComponent = url => {
    const [{ loading, err, component }, setState] = useState({ loading: true });

    useEffect(() => {
      setState({loading: true})
      loadRemoteModule(url)
        .then(module => setState({ loading: false, component: module.default }))
        .catch(err => setState({ loading: false, err }));
    }, [url]);

    return [loading, err, component];
  };

  return useRemoteComponent;
};
