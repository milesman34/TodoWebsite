import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

beforeAll(() => {
    vi.mock("nanoid", () => ({
        nanoid: vi.fn()
    }));
});

afterEach(() => {
    cleanup();
});
