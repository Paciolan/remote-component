import { join } from "path";

export const getDependencies = () => {
  try {
    /* istanbul ignore next */
    return process.env.NODE_ENV === "test"
      ? require(join(process.cwd(), "./remote-component.config.js")).resolve
      : require("remote-component.config.js").resolve;
  } catch (err) {
    return {};
  }
};
