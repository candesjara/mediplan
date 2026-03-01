export default {
  testEnvironment: "node",
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js"
  ],
  testMatch: ["<rootDir>/tests/**/*.test.js"]
};
