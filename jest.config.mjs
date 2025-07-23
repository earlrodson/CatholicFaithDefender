export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/server/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!(drizzle-orm|@drizzle-orm|@neondatabase|@libsql|better-sqlite3|mysql2|pg|pg-query-stream|pg-protocol|pgpass|pino-pretty|pino-pretty|pino-std-serializers|pump|readable-stream|sqlite3|tedious|ws)/)',
  ],
};
