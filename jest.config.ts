import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
  moduleNameMapper: {
    '^@assets/(.*)\\.svg\\?react$': '<rootDir>/src/app/assets/$1.svg',
    '^@public(.*)$': '<rootDir>/public$1',
    '^@src(.*)$': '<rootDir>/src$1',
    '^@app(.*)$': '<rootDir>/src/app$1',
    '^@assets(.*)$': '<rootDir>/src/app/assets$1',
    '^@hooks(.*)$': '<rootDir>/src/app/hooks$1',
    '^@models(.*)$': '<rootDir>/src/app/models$1',
    '^@store(.*)$': '<rootDir>/src/app/store$1',  
    '^@styles(.*)$': '<rootDir>/src/app/styles$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1',
    '^@views(.*)$': '<rootDir>/src/views$1',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.ts',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.svg(\\?react)?$': 'jest-transformer-svg',
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
}

export default config