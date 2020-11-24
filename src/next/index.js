import createLoadRemoteModule from "@paciolan/remote-module-loader";

/**
 * Get Server Side Props for Next.js apps
 * @param {object} options
 * @param {string} options.url
 * @param {Function} options.requires
 * @param {object} options.context
 * @param {string} options.imports
 * @returns {object}
 */
export const getServerSideProps = ({
  url,
  requires,
  context,
  imports = "default"
}) => {
  const loadRemoteModule = createLoadRemoteModule({ requires });

  return loadRemoteModule(url).then(module => {
    const func =
      module && module[imports] && module[imports].getServerSideProps;

    return typeof func === "function" ? func(context) : {};
  });
};
