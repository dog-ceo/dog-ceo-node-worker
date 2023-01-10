export default {
    testEnvironment: "miniflare",
    testEnvironmentOptions: {
        //modules: true,
        //bindings: { KEY: "value" },
        //kvNamespaces: ["DOGSTUFF"],
    },
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!<rootDir>/node_modules/"
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^(\\.{1,2}/.*)\\.js$": "$1",
        // https://stackoverflow.com/questions/73203367/jest-syntaxerror-unexpected-token-export-with-uuid-library
        "^uuid$": "uuid"
    },
    preset: "ts-jest/presets/default-esm",
    globals: {
        "ts-jest": {
            tsconfig: "test/tsconfig.json",
            useESM: true,
        },
    },
};