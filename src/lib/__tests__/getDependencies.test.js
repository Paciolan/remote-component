/* eslint-env node */
import fs from "fs";
import { getDependencies } from "../getDependencies";
import { join } from "path";

const remoteComponentConfigPath = join(process.cwd(), "remote-component.config.js"); // prettier-ignore

describe("lib/getDependencies", () => {
  describe("with no remote-component.config.js", () => {
    test("returns {}", () => {
      const actual = getDependencies();
      const expected = {};
      expect(actual).toMatchObject(expected);
    });
  });

  describe("with remote-component.config.js", () => {
    beforeAll(() => {
      fs.writeFileSync(
        remoteComponentConfigPath,
        'module.exports = { resolve: { jest: require("jest") } };'
      );
    });

    afterAll(() => {
      fs.unlinkSync(remoteComponentConfigPath);
    });

    test("returns dependencies", () => {
      const actual = getDependencies();
      const expected = { jest: require("jest") };
      expect(actual).toMatchObject(expected);
    });
  });
});
