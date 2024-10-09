import { describe, expect, test } from "vitest";
import { mockLocalStorage, mockSessionStorage } from "./testUtils";
import { loadOpenTaskIDs, loadTaskListTypeSession, setupStore } from "./storageTools";
import { TaskListType } from "../redux/todoSlice";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";

describe("storageTools", () => {
    describe("loadTaskListTypeSession", () => {
        test("load null", () => {
            mockSessionStorage({});

            expect(loadTaskListTypeSession()).toEqual(TaskListType.All);
        });

        test("load all", () => {
            mockSessionStorage({ taskListType: "0" });

            expect(loadTaskListTypeSession()).toEqual(TaskListType.All);
        });

        test("load ungrouped", () => {
            mockSessionStorage({ taskListType: "1" });

            expect(loadTaskListTypeSession()).toEqual(TaskListType.Ungrouped);
        });

        test("load task group", () => {
            mockSessionStorage({ taskListType: "2" });

            expect(loadTaskListTypeSession()).toEqual(TaskListType.TaskGroup);
        });
    });

    describe("loadOpenTaskIDs", () => {
        test("load null", () => {
            mockSessionStorage({});

            expect(loadOpenTaskIDs()).toEqual([]);
        });

        test("load invalid", () => {
            mockSessionStorage({ openTasks: "[[[" });

            expect(loadOpenTaskIDs()).toEqual([]);
        });

        test("load valid", () => {
            mockSessionStorage({ openTasks: JSON.stringify(["id1", "id2", "id3"]) });

            expect(loadOpenTaskIDs()).toEqual(["id1", "id2", "id3"]);
        });
    });

    describe("setupStore", () => {
        test("setupStore with empty storage", () => {
            mockLocalStorage({});
            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore sets up groups", () => {
            const groups = [TaskGroup({ name: "Group", id: "id1" })];

            mockLocalStorage({ taskGroups: JSON.stringify(groups) });
            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.groups).toEqual(groups);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore sets up tasks", () => {
            const tasks = [
                Task({ name: "Task 1", id: "id1" }),
                Task({ name: "Task 2", id: "id2" })
            ];

            mockLocalStorage({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id1": JSON.stringify(tasks[0]),
                "tasks-id2": JSON.stringify(tasks[1])
            });

            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual(tasks);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore switches to all tasks", () => {
            mockLocalStorage({});

            mockSessionStorage({
                taskListType: "0"
            });

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore switches to ungrouped tasks", () => {
            mockLocalStorage({});

            mockSessionStorage({
                taskListType: "1"
            });

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.Ungrouped);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore tries to switch to a task group, but can't because it isn't valid", () => {
            mockLocalStorage({});

            mockSessionStorage({
                taskListType: "2"
            });

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore switches to a task group", () => {
            mockLocalStorage({});

            mockSessionStorage({
                taskListType: "2",
                activeTaskGroup: "id1"
            });

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.TaskGroup);
            expect(state.activeTaskGroup).toBe("id1");
        });

        test("setupStore gets the open tasks", () => {
            const tasks = [
                Task({ name: "Task 1", id: "id1" }),
                Task({ name: "Task 2", id: "id2" })
            ];

            mockLocalStorage({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id1": JSON.stringify(tasks[0]),
                "tasks-id2": JSON.stringify(tasks[1])
            });

            mockSessionStorage({
                openTasks: JSON.stringify(["id2"])
            });

            const state = setupStore().getState();

            expect(state.groups).toEqual([]);
            expect(state.tasks).toEqual([
                {
                    ...tasks[0],
                    isOpen: false
                },
                {
                    ...tasks[1],
                    isOpen: true
                }
            ]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });
    });
});
