module.exports = {
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    jest: {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '\\.ts$': ['babel-jest', { configFile: './test/babel.config.js' }],
  },
}
