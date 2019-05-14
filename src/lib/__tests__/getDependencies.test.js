/* eslint-env node */
import { getDependencies } from "../getDependencies";

describe("lib/getDependencies", () => {
  describe("with no remote-component.config.js", () => {
    test("returns {}", () => {
      const actual = getDependencies();
      const expected = {};
      expect(actual).toMatchObject(expected);
    });
  });
});
