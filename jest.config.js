module.exports = {
  testIgnorePatterns: ["/node_modules/", "/.next/"],
  setupFilesAfterEnv: ["<rootdir>/src/tests/setupTests.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootdir>/node_modules/babel-jest",
  },
  textEnvironment: "jsdom",
};
