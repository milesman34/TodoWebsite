import { describe, expect, test } from "vitest";
import { mockLocalStorage } from "../../utils/testUtils";
import { parseTaskGroupsLocalStorage, TaskGroup } from "./TaskGroup";

describe("TaskGroup", () => {
    describe("parseTaskGroupsLocalStorage", () => {
        test("localStorage does not have taskGroups", () => {
            mockLocalStorage({});

            expect(parseTaskGroupsLocalStorage()).toEqual([]);
        });

        test("localStorage has empty taskGroups", () => {
            mockLocalStorage({ taskGroups: "[]" });

            expect(parseTaskGroupsLocalStorage()).toEqual([]);
        });

        test("localStorage has corrupted taskGroups", () => {
            mockLocalStorage({ taskGroups: '[{name: "35", descriptor: "3"}]' });

            expect(parseTaskGroupsLocalStorage()).toEqual([]);
        });

        test("localStorage with working taskGroups", () => {
            mockLocalStorage({
                taskGroups: JSON.stringify([
                    TaskGroup({
                        name: "My group",
                        id: "id1"
                    })
                ])
            });

            expect(parseTaskGroupsLocalStorage()).toEqual([
                {
                    name: "My group",
                    description: "",
                    id: "id1"
                }
            ]);
        });
    });
});
