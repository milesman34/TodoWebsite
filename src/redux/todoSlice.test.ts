import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import reducer, {
    addTask,
    addTaskGroup,
    initialState,
    selectAllTasks,
    selectTasksInActiveGroup,
    selectTasksInCurrentTaskList,
    selectUngroupedTasks,
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

    describe("selectAllTasks", () => {
        test("selectAllTasks selects all tasks", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList
            };

            expect(selectAllTasks(state)).toEqual(taskList);
        });
    });

    describe("selectUngroupedTasks", () => {
        test("selectUngroupedTasks selects all ungrouped tasks", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList
            };

            expect(selectUngroupedTasks(state)).toEqual([taskList[0], taskList[3]]);
        });
    });

    describe("selectTasksInActiveGroup", () => {
        test("selectTasksInActiveGroup selects all tasks in the active group", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList,
                activeTaskGroup: "id1"
            };

            expect(selectTasksInActiveGroup(state)).toEqual([taskList[1], taskList[2]]);
        });
    });

    describe("selectTasksInCurrentTaskList", () => {
        test("selectTasksInCurrentTaskList with all tasks", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList,
                taskListType: TaskListType.All
            };

            expect(selectTasksInCurrentTaskList(state)).toEqual(taskList);
        });

        test("selectTasksInCurrentTaskList with ungrouped tasks", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList,
                taskListType: TaskListType.Ungrouped
            };

            expect(selectTasksInCurrentTaskList(state)).toEqual([
                taskList[0],
                taskList[3]
            ]);
        });

        test("selectTasksInCurrentTaskList with an active task group", () => {
            const taskList = [
                Task("My task", "", "id1", "", 0, []),
                Task("My task 2", "Why", "id2", "id1", 1, []),
                Task("My task 3", "Testing", "id3", "id1", 2, []),
                Task("My task 4", "", "id4", "", 0, []),
                Task("My task 5", "", "id5", "id3", -1, [])
            ];

            const state = {
                ...initialState,
                tasks: taskList,
                taskListType: TaskListType.TaskGroup,
                activeTaskGroup: "id1"
            };

            expect(selectTasksInCurrentTaskList(state)).toEqual([
                taskList[1],
                taskList[2]
            ]);
        });
    });
});