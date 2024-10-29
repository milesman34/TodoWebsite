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
            mockLocalStorage({ taskGroups: '[{name: "35", descriptor "3"}]' });

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

        test("localStorage with wrong type", () => {
            mockLocalStorage({
                taskGroups: JSON.stringify([3, 5])
            });

            expect(parseTaskGroupsLocalStorage()).toEqual([]);
        });

        test("localStorage with only some working task groups", () => {
            const group1 = TaskGroup({
                name: "Group 1",
                id: "id1"
            });

            const group2 = TaskGroup({
                name: "Group 2",
                id: "id2"
            });

            mockLocalStorage({
                taskGroups: JSON.stringify([
                    group1,
                    {
                        name: "My group",
                        id2: "id"
                    },
                    group2
                ])
            });

            expect(parseTaskGroupsLocalStorage()).toEqual([group1, group2]);
        });

        test("localStorage when not an array", () => {
            mockLocalStorage({
                taskGroups: "35"
            });

            expect(parseTaskGroupsLocalStorage()).toEqual([]);
        });
    });
});
