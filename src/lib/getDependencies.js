const cannotFindModule = err =>
  err &&
  typeof err.message === "string" &&
  err.message.indexOf("Cannot find module") > -1;

export const getDependencies = () => {
  try {
    return require("remote-component.config.js").resolve;
  } catch (err) {
    // istanbul ignore next: This is just too impossible to test
    if (!cannotFindModule(err)) {
      throw err;
    }

    return {};
  }
};
