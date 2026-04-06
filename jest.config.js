module.exports = {
  testEnvironment: "jsdom",
  collectCoverageFrom: ["./src/**/*.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
