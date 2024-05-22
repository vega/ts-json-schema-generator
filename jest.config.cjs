/** @type {import('jest').Config} */
const config = {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    moduleFileExtensions: ["js", "ts", "json"],
    testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/build/"],
    coverageDirectory: "./coverage/",
    collectCoverage: false,
    testEnvironment: "node",
    maxWorkers: '50%', // speeds up tests
    transform: {
        ".*": "babel-jest",
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};

module.exports = config;
