import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            reporter: ["text", "json", "html"]
        },

        environment: "jsdom",
        setupFiles: ["src/utils/setupTests.ts"]
    }
});
