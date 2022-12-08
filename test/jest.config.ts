import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  moduleDirectories: ['node_modules', __dirname],
  moduleFileExtensions: ['ts', 'js', 'json'],
  preset: 'ts-jest',
  rootDir: '..',
  setupFilesAfterEnv: ['./test/setup.ts'],
  testTimeout: 10000,
  verbose: true,
}

export default jestConfig
