import { describe, expect, test } from "vitest";
import { mockLocalStorage } from "../../utils/testUtils";
import { formatTaskForStorage, parseTasksLocalStorage, Task } from "./Task";

describe("Task", () => {
    describe("parseTasksLocalStorage", () => {
        test("No tasks item", () => {
            mockLocalStorage({});

            expect(parseTasksLocalStorage()).toEqual([]);
        });

        test("Empty tasks item", () => {
            mockLocalStorage({ tasks: JSON.stringify([]) });

            expect(parseTasksLocalStorage()).toEqual([]);
        });

        test("Corrupted tasks item", () => {
            mockLocalStorage({ tasks: "[{25]" });

            expect(parseTasksLocalStorage()).toEqual([]);
        });

        test("Tasks item with incorrect type", () => {
            mockLocalStorage({ tasks: "5" });

            expect(parseTasksLocalStorage()).toEqual([]);
        });

        test("Working tasks item", () => {
            mockLocalStorage({
                tasks: JSON.stringify(["id1"]),
                "tasks-id1": JSON.stringify(
                    formatTaskForStorage(Task({ name: "My task", id: "id1" }))
                )
            });

            expect(parseTasksLocalStorage()).toEqual([
                Task({ name: "My task", id: "id1", isOpen: false })
            ]);
        });

        test("Working tasks item with missing task", () => {
            mockLocalStorage({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id2": JSON.stringify(
                    formatTaskForStorage(Task({ name: "My task", id: "id2" }))
                )
            });

            expect(parseTasksLocalStorage()).toEqual([
                Task({ name: "My task", id: "id2", isOpen: false })
            ]);
        });

        test("Working tasks item with corrupted task", () => {
            mockLocalStorage({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id1": JSON.stringify(
                    formatTaskForStorage(Task({ name: "My task", id: "id1" }))
                ),
                "tasks-id2": "{[3]]}"
            });

            expect(parseTasksLocalStorage()).toEqual([
                Task({ name: "My task", id: "id1", isOpen: false })
            ]);
        });

        test("Working tasks item with task not matching schema", () => {
            mockLocalStorage({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id1": JSON.stringify(
                    formatTaskForStorage(Task({ name: "My task", id: "id1" }))
                ),
                "tasks-id2": JSON.stringify({ name: "My task 2" })
            });

            expect(parseTasksLocalStorage()).toEqual([
                Task({ name: "My task", id: "id1", isOpen: false })
            ]);
        });
    });
});
