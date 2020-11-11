module.exports = {
  moduleNameMapper: {
    "\\.(css|less)$": "identity-obj-proxy",
    "^COMPONENTS(.*)$": "<rootDir>/src/components$1"
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {"\\.[jt]sx?$": "babel-jest"}
}