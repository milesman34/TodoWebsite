import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { useDetectKeydown } from "./useDetectKeydown";

describe("useDetectKeydown", () => {
    test("useDetectKeydown correct keypress", async () => {
        const mock = vi.fn();

        renderHook(() => useDetectKeydown("Enter", mock));

        await userEvent.keyboard("{Enter}");

        expect(mock).toHaveBeenCalled();
    });

    test("useDetectKeydown wrong keypress", async () => {
        const mock = vi.fn();

        renderHook(() => useDetectKeydown("Enter", mock));

        await userEvent.keyboard("{Shift}");

        expect(mock).not.toHaveBeenCalled();
    });
});
