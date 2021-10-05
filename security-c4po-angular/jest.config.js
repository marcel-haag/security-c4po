module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '@shared/(.*)': '<rootDir>/src/shared/$1'
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
