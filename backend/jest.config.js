module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/prisma/'],
  testMatch: ['**/__tests__/**/*.test.js?(x)'], // Asegura que encuentre los tests
};
