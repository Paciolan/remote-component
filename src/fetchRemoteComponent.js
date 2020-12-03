import createLoadRemoteModule from "@paciolan/remote-module-loader";

/**
 * Fetches a Remote Component for Server Side Rendering using next/dynamic.
 * @param {object} options
 * @param {string} options.url
 * @param {Function} options.requires
 * @param {string} options.imports
 * @returns {Promise<object>}
 */
export const fetchRemoteComponent = ({
  requires,
  url,
  imports = "default"
}) => {
  const loadRemoteModule = createLoadRemoteModule({ requires });

  return loadRemoteModule(url).then(module => {
    const Component = module && module[imports];
    if (!Component) {
      throw new Error(`Could not load '${imports}' from '${url}'.`);
    }
    return Component;
  });
  // suppressHydrationWarning={true}
};
