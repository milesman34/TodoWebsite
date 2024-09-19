export default {
    preset: "ts-jest",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/**/*.{js,ts,jsx,tsx}",
        "!<rootDir>/src/**/*test.{js,ts,jsx,tsx}",
        "!**/node_modules/**"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["json", "html"],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/.next/",
        "/out/",
        "/public/",
        "/vendor/"
    ],
    moduleNameMapper: {
        "\\.(css|less)$": "identity-obj-proxy"
    }
};
