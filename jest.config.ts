export default {
    testEnvironment: "miniflare",
    testEnvironmentOptions: {
        // Miniflare doesn't yet support the `main` field in `wrangler.toml` so we
        // need to explicitly tell it where our built worker is. We also need to
        // explicitly mark it as an ES module.
        //scriptPath: "dist/index.mjs",
        //modules: true,
        //bindings: { KEY: "value" },
        //kvNamespaces: ["TEST_NAMESPACE"],
    },
    collectCoverageFrom: [
        "index.js",
        "src/*.js"
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