/** @type {import("jest").Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  clearMocks: true,
  transform: {
    "^.+\\.ts$": ["ts-jest", { diagnostics: { ignoreCodes: [151002] } }]
  }
};
