import fs from "fs";
import { join } from "path";

export const getDependencies = () => {
  const filepath = join(process.cwd(), "./remote-component.config.js");

  if (fs.existsSync(filepath)) {
    return require(filepath).resolve;
  }

  try {
    require("remote-component.config.js").resolve;
  } catch (err) {
    return {};
  }
};
