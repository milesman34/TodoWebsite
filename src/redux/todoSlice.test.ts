import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import reducer, {
    addTask,
    addTaskGroup,
    initialState,
    setActiveTaskGroup,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "./todoSlice";

import { describe, expect, test } from "vitest";

describe("todoSlice", () => {
    describe("addTaskGroup", () => {
        test("addTaskGroup adds a task group", () => {
            const state = initialState;

            const taskGroup = TaskGroup("Test", "", "0");

            const newState = reducer(state, addTaskGroup(taskGroup));

            expect(newState.groups).toEqual([taskGroup]);
        });

        test("addTaskGroup adds multiple task groups", () => {
            const state = initialState;

            const taskGroup1 = TaskGroup("Test", "", "0");
            const taskGroup2 = TaskGroup("Test2", "Description", "1");

            const newState1 = reducer(state, addTaskGroup(taskGroup1));
            const newState2 = reducer(newState1, addTaskGroup(taskGroup2));

            expect(newState2.groups).toEqual([taskGroup1, taskGroup2]);
        });

        test("addTaskGroup updates active task group", () => {
            const state = initialState;

            const taskGroup1 = TaskGroup("Test", "", "0");
            const taskGroup2 = TaskGroup("Test2", "Description", "1");

            const newState1 = reducer(state, addTaskGroup(taskGroup1));
            const newState2 = reducer(newState1, addTaskGroup(taskGroup2));

            expect(newState2.groups).toEqual([taskGroup1, taskGroup2]);
            expect(newState2.activeTaskGroup).toBe("1");
        });

        test("addTaskGroup updates task list type", () => {
            const state = initialState;

            const taskGroup = TaskGroup("Test", "", "0");

            const newState = reducer(state, addTaskGroup(taskGroup));

            expect(newState.taskListType).toEqual(TaskListType.TaskGroup);
        });
    });

    describe("setActiveTaskGroup", () => {
        test("setActiveTaskGroup sets the task group", () => {
            let state = initialState;

            state = reducer(state, setActiveTaskGroup("Test"));

            expect(state.activeTaskGroup).toBe("Test");
        });

        test("setActiveTaskGroup sets the task list type", () => {
            let state = initialState;

            state = reducer(state, setActiveTaskGroup("Test"));

            expect(state.taskListType).toEqual(TaskListType.TaskGroup);
        });

        test("setActiveTaskGroup when set to an empty string should set the task list type to all tasks", () => {
            let state = {
                ...initialState,
                taskListType: TaskListType.TaskGroup
            };

            state = reducer(state, setActiveTaskGroup(""));

            expect(state.taskListType).toEqual(TaskListType.All);
        });
    });

    describe("switchToAllTasks", () => {
        test("switchToAllTasks sets the task list type", () => {
            let state = {
                ...initialState,
                taskListType: TaskListType.TaskGroup
            };

            state = reducer(state, switchToAllTasks());

            expect(state.taskListType).toEqual(TaskListType.All);
        });

        test("switchToAllTasks clears the current active task group", () => {
            let state = {
                ...initialState,
                activeTaskGroup: "Task group",
                taskListType: TaskListType.TaskGroup
            };

            state = reducer(state, switchToAllTasks());

            expect(state.activeTaskGroup).toBe("");
        });
    });

    describe("switchToUngroupedTasks", () => {
        test("switchToUngroupedTasks sets the task list type", () => {
            let state = {
                ...initialState,
                taskListType: TaskListType.TaskGroup
            };

            state = reducer(state, switchToUngroupedTasks());

            expect(state.taskListType).toEqual(TaskListType.Ungrouped);
        });

        test("switchToUngroupedTasks clears the current active task group", () => {
            let state = {
                ...initialState,
                activeTaskGroup: "Task group",
                taskListType: TaskListType.TaskGroup
            };

            state = reducer(state, switchToUngroupedTasks());

            expect(state.activeTaskGroup).toBe("");
        });
    });

    describe("addTask", () => {
        test("addTask adds a task", () => {
            let state = initialState;

            const task = Task("My task", "", "id1", "id1", 0, []);

            state = reducer(state, addTask(task));

            expect(state.tasks).toEqual([task]);
        });

        test("addTask updates active task", () => {
            let state = initialState;

            const task = Task("My task", "", "id1", "id1", 0, []);

            state = reducer(state, addTask(task));

            expect(state.activeTask).toBe("id1");
        });
    });
});
