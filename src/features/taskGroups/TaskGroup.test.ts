import { describe, test, vi } from "vitest";

describe("TaskGroup", () => {
    describe("parseTaskGroupsLocalStorage", () => {
        test("localStorage does not have taskGroups", () => {
            vi.stubGlobal("localStorage.getItem", (key: string): string => key);

            console.log(localStorage.getItem("this"));
        });
    });
});
