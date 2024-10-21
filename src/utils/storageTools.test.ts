import { describe, expect, test } from "vitest";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import { AppPage, TaskListType } from "../redux/todoSlice";
import {
    loadCurrentPage,
    loadOpenTaskIDs,
    loadTaskListType,
    setupStore
} from "./storageTools";
import { mockLocalStorage, mockSessionStorage } from "./testUtils";

describe("storageTools", () => {
    describe("loadTaskListType", () => {
        test("load null", () => {
            mockSessionStorage({});

            expect(loadTaskListType()).toEqual(TaskListType.All);
        });

        test("load all", () => {
            mockSessionStorage({ taskListType: "0" });

            expect(loadTaskListType()).toEqual(TaskListType.All);
        });

        test("load ungrouped", () => {
            mockSessionStorage({ taskListType: "1" });

            expect(loadTaskListType()).toEqual(TaskListType.Ungrouped);
        });

        test("load task group", () => {
            mockSessionStorage({ taskListType: "2" });

            expect(loadTaskListType()).toEqual(TaskListType.TaskGroup);
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

    describe("loadCurrentPage", () => {
        test("load null", () => {
            mockSessionStorage({});

            expect(loadCurrentPage()).toEqual(AppPage.Main);
        });

        test("load main", () => {
            mockSessionStorage({ currentPage: "0" });

            expect(loadCurrentPage()).toEqual(AppPage.Main);
        });

        test("load manage save", () => {
            mockSessionStorage({ currentPage: "1" });

            expect(loadCurrentPage()).toEqual(AppPage.ManageSave);
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

        test("setupScore switches to the main page", () => {
            mockSessionStorage({
                currentPage: "0"
            });

            const state = setupStore().getState();

            expect(state.currentPage).toEqual(AppPage.Main);
        });

        test("setupScore switches to the manage save page", () => {
            mockSessionStorage({
                currentPage: "1"
            });

            const state = setupStore().getState();

            expect(state.currentPage).toEqual(AppPage.ManageSave);
        });
    });
});
