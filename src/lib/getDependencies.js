const cannotFindModule = err =>
  err &&
  typeof err.message === "string" &&
  err.message.indexOf("Cannot find module") > -1;

const isConfigInResolve = config =>
  typeof config === "object" && "remote-component.config.js" in config;

/**
 * Makes sure the config contains remote-component.config.js.
 * If not, then it adds it.
 */
export const ensureRemoteComponentConfig = ({ resolve }) => {
  if (isConfigInResolve(resolve)) {
    return resolve;
  }

  // add remote-component.config.js recursively
  const newResolve = { ...resolve };
  newResolve["remote-component.config.js"] = { resolve: newResolve };

  return newResolve;
};

export const getDependencies = () => {
  try {
    return ensureRemoteComponentConfig(require("remote-component.config.js"));
  } catch (err) {
    // istanbul ignore next: This is just too impossible to test
    if (!cannotFindModule(err)) {
      throw err;
    }

    return {};
  }
};
