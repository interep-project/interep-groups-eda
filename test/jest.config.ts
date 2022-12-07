import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['src/config.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleDirectories: ['node_modules', __dirname],
  moduleFileExtensions: ['ts', 'js', 'json'],
  preset: 'ts-jest',
  rootDir: '..',
  setupFilesAfterEnv: ['./test/setup.ts'],
  verbose: true,
}

export default jestConfig
