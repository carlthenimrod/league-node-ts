module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/middleware/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1'
  }
};