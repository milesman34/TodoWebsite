import { describe, expect, test } from "vitest";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { formatTaskForStorage, Task } from "../features/tasks/Task";
import {
    AppPage,
    Operator,
    SortOrder,
    SortParameter,
    TaskListType
} from "../redux/todoSlice";
import {
    loadCurrentPage,
    loadFilterDescription,
    loadFilterName,
    loadFilterPriorityOperator,
    loadFilterPriorityThreshold,
    loadFromSaveText,
    loadOpenTaskIDs,
    loadTaskListType,
    loadTaskSortOrder,
    loadTaskSortParam,
    resetSaveData,
    setupStore
} from "./storageTools";
import { mockLocalStorage, mockLocalStorageFull, mockSessionStorage } from "./testUtils";

describe("storageTools", () => {
    describe("loaders", () => {
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

            test("load invalid with schema", () => {
                mockSessionStorage({ openTasks: "[3, 5]" });

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

        describe("loadTaskSortParam", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadTaskSortParam()).toEqual(SortParameter.None);
            });

            test("load none", () => {
                mockSessionStorage({ taskSortParam: "0" });

                expect(loadTaskSortParam()).toEqual(SortParameter.None);
            });

            test("load name", () => {
                mockSessionStorage({ taskSortParam: "1" });

                expect(loadTaskSortParam()).toEqual(SortParameter.Name);
            });

            test("load priority", () => {
                mockSessionStorage({ taskSortParam: "2" });

                expect(loadTaskSortParam()).toEqual(SortParameter.Priority);
            });
        });

        describe("loadTaskSortOrder", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadTaskSortOrder()).toEqual(SortOrder.Ascending);
            });

            test("load ascending", () => {
                mockSessionStorage({ taskSortOrder: "0" });

                expect(loadTaskSortOrder()).toEqual(SortOrder.Ascending);
            });

            test("load descending", () => {
                mockSessionStorage({ taskSortOrder: "1" });

                expect(loadTaskSortOrder()).toEqual(SortOrder.Descending);
            });
        });

        describe("loadFilterName", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadFilterName()).toBe("");
            });

            test("load with value", () => {
                mockSessionStorage({ filterName: "task" });

                expect(loadFilterName()).toBe("task");
            });
        });

        describe("loadFilterDescription", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadFilterDescription()).toBe("");
            });

            test("load with value", () => {
                mockSessionStorage({ filterDescription: "task" });

                expect(loadFilterDescription()).toBe("task");
            });
        });

        describe("loadFilterPriorityThreshold", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadFilterPriorityThreshold()).toBe(0);
            });

            test("load invalid", () => {
                mockSessionStorage({ filterPriorityThreshold: "sfttw" });

                expect(loadFilterPriorityThreshold()).toBe(0);
            });

            test("load valid", () => {
                mockSessionStorage({ filterPriorityThreshold: "5" });

                expect(loadFilterPriorityThreshold()).toBe(5);
            });
        });

        describe("loadFilterPriorityOperator", () => {
            test("load null", () => {
                mockSessionStorage({});

                expect(loadFilterPriorityOperator()).toEqual(Operator.None);
            });

            test("load none", () => {
                mockSessionStorage({ filterPriorityOperator: "0" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.None);
            });

            test("load equals", () => {
                mockSessionStorage({ filterPriorityOperator: "1" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.Equals);
            });

            test("load not equals", () => {
                mockSessionStorage({ filterPriorityOperator: "2" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.NotEquals);
            });

            test("load less", () => {
                mockSessionStorage({ filterPriorityOperator: "3" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.LessThan);
            });

            test("load greater", () => {
                mockSessionStorage({ filterPriorityOperator: "4" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.GreaterThan);
            });

            test("load less or equal", () => {
                mockSessionStorage({ filterPriorityOperator: "5" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.LessOrEqual);
            });

            test("load greater or equal", () => {
                mockSessionStorage({ filterPriorityOperator: "6" });

                expect(loadFilterPriorityOperator()).toEqual(Operator.GreaterOrEqual);
            });
        });
    });

    describe("setupStore", () => {
        test("setupStore with empty storage", () => {
            mockLocalStorage({});
            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.taskGroups).toEqual([]);
            expect(state.tasks).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.activeTaskGroup).toBe("");
        });

        test("setupStore sets up groups", () => {
            const groups = [TaskGroup({ name: "Group", id: "id1" })];

            mockLocalStorage({ taskGroups: JSON.stringify(groups) });
            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.taskGroups).toEqual(groups);
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
                "tasks-id1": JSON.stringify(formatTaskForStorage(tasks[0])),
                "tasks-id2": JSON.stringify(formatTaskForStorage(tasks[1]))
            });

            mockSessionStorage({});

            const state = setupStore().getState();

            expect(state.taskGroups).toEqual([]);
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

            expect(state.taskGroups).toEqual([]);
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

            expect(state.taskGroups).toEqual([]);
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

            expect(state.taskGroups).toEqual([]);
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

            expect(state.taskGroups).toEqual([]);
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
                "tasks-id1": JSON.stringify(formatTaskForStorage(tasks[0])),
                "tasks-id2": JSON.stringify(formatTaskForStorage(tasks[1]))
            });

            mockSessionStorage({
                openTasks: JSON.stringify(["id2"])
            });

            const state = setupStore().getState();

            expect(state.taskGroups).toEqual([]);
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

        test("setupStore switches to the main page", () => {
            mockSessionStorage({
                currentPage: "0"
            });

            const state = setupStore().getState();

            expect(state.currentPage).toEqual(AppPage.Main);
        });

        test("setupStore switches to the manage save page", () => {
            mockSessionStorage({
                currentPage: "1"
            });

            const state = setupStore().getState();

            expect(state.currentPage).toEqual(AppPage.ManageSave);
        });

        test("setupStore sets the task sort parameter to none", () => {
            mockSessionStorage({
                taskSortParam: "0"
            });

            const state = setupStore().getState();

            expect(state.taskSortParam).toEqual(SortParameter.None);
        });

        test("setupStore sets the task sort parameter to name", () => {
            mockSessionStorage({
                taskSortParam: "1"
            });

            const state = setupStore().getState();

            expect(state.taskSortParam).toEqual(SortParameter.Name);
        });

        test("setupStore sets the task sort parameter to priority", () => {
            mockSessionStorage({
                taskSortParam: "2"
            });

            const state = setupStore().getState();

            expect(state.taskSortParam).toEqual(SortParameter.Priority);
        });

        test("setupStore sets the task sort order to ascending", () => {
            mockSessionStorage({
                taskSortOrder: "0"
            });

            const state = setupStore().getState();

            expect(state.taskSortOrder).toEqual(SortOrder.Ascending);
        });

        test("setupStore sets the task sort order to descending", () => {
            mockSessionStorage({
                taskSortOrder: "1"
            });

            const state = setupStore().getState();

            expect(state.taskSortOrder).toEqual(SortOrder.Descending);
        });

        test("setupStore sets the task filter name", () => {
            mockSessionStorage({
                filterName: "task"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.name).toBe("task");
        });

        test("setupStore sets the task filter description", () => {
            mockSessionStorage({
                filterDescription: "task"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.description).toBe("task");
        });

        test("setupStore sets the task filter priority", () => {
            mockSessionStorage({
                filterPriorityThreshold: "3"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityThreshold).toBe(3);
        });

        test("setupStore sets the task filter priority operator to none", () => {
            mockSessionStorage({
                filterPriorityOperator: "0"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.None);
        });

        test("setupStore sets the task filter priority operator to equals", () => {
            mockSessionStorage({
                filterPriorityOperator: "1"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.Equals);
        });

        test("setupStore sets the task filter priority operator to not equals", () => {
            mockSessionStorage({
                filterPriorityOperator: "2"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.NotEquals);
        });

        test("setupStore sets the task filter priority operator to less", () => {
            mockSessionStorage({
                filterPriorityOperator: "3"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.LessThan);
        });

        test("setupStore sets the task filter priority operator to greater", () => {
            mockSessionStorage({
                filterPriorityOperator: "4"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.GreaterThan);
        });

        test("setupStore sets the task filter priority operator to less or equal", () => {
            mockSessionStorage({
                filterPriorityOperator: "5"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(Operator.LessOrEqual);
        });

        test("setupStore sets the task filter priority operator to greater or equal", () => {
            mockSessionStorage({
                filterPriorityOperator: "6"
            });

            const state = setupStore().getState();

            expect(state.filterSettings.priorityOperator).toEqual(
                Operator.GreaterOrEqual
            );
        });
    });

    describe("resetSaveData", () => {
        test("Resets task groups in localStorage", () => {
            const mockSetItem = mockLocalStorage({
                taskGroups: JSON.stringify([
                    {
                        name: "My group",
                        id: "id1"
                    },
                    {
                        name: "Next group",
                        id: "id2"
                    }
                ])
            });

            resetSaveData([]);

            expect(mockSetItem).toHaveBeenCalledWith("taskGroups", JSON.stringify([]));
        });

        test("Resets active task group in sessionStorage", () => {
            const mockSetItem = mockSessionStorage({
                activeTaskGroup: "id2"
            });

            resetSaveData([]);

            expect(mockSetItem).toHaveBeenCalledWith("activeTaskGroup", "");
        });

        test("Resets tasks in localStorage", () => {
            const { setItem, removeItem } = mockLocalStorageFull({
                tasks: JSON.stringify(["id1", "id2"]),
                "tasks-id1": "{}",
                "tasks-id2": "{}"
            });

            resetSaveData(["id1", "id2"]);

            expect(setItem).toHaveBeenCalledWith("tasks", "[]");
            expect(removeItem).toHaveBeenCalledWith("tasks-id1");
            expect(removeItem).toHaveBeenCalledWith("tasks-id2");
        });

        test("Resets task list type in sessionStorage", () => {
            const mockSetItem = mockSessionStorage({
                taskListType: "1"
            });

            resetSaveData([]);

            expect(mockSetItem).toHaveBeenCalledWith("taskListType", "0");
        });

        test("Resets open tasks in sessionStorage", () => {
            const mockSetItem = mockSessionStorage({
                taskListType: JSON.stringify(["id1", "id2"])
            });

            resetSaveData([]);

            expect(mockSetItem).toHaveBeenCalledWith("openTasks", "[]");
        });

        test("Current page should not be reset", () => {
            const mockSetItem = mockSessionStorage({
                currentPage: "1"
            });

            resetSaveData([]);

            expect(mockSetItem).not.toHaveBeenCalledWith("currentPage", "1");
        });
    });

    describe("loadFromSaveText", () => {
        test("Parse error with JSON", () => {
            expect(loadFromSaveText("[[[[[")).toEqual({
                tasks: [],
                taskGroups: []
            });
        });

        test("Tasks not found", () => {
            expect(loadFromSaveText(JSON.stringify({ taskGroups: [] }))).toEqual({
                tasks: [],
                taskGroups: []
            });
        });

        test("TaskGroups not found", () => {
            expect(loadFromSaveText(JSON.stringify({ tasks: [] }))).toEqual({
                tasks: [],
                taskGroups: []
            });
        });

        test("Tasks not right type", () => {
            expect(
                loadFromSaveText(JSON.stringify({ tasks: 5, taskGroups: [] }))
            ).toEqual({
                tasks: [],
                taskGroups: []
            });
        });

        test("Working tasks", () => {
            const tasks = [
                formatTaskForStorage(Task({ id: "id1", name: "My task" })),
                formatTaskForStorage(Task({ id: "id2", name: "Another task" }))
            ];

            expect(
                loadFromSaveText(
                    JSON.stringify({
                        tasks: [
                            tasks[0],
                            tasks[1],
                            {
                                invalid: "test"
                            }
                        ]
                    })
                )
            ).toEqual({
                tasks: [
                    {
                        ...tasks[0],
                        isOpen: false
                    },

                    {
                        ...tasks[1],
                        isOpen: false
                    }
                ],
                taskGroups: []
            });
        });

        test("TaskGroups not right type", () => {
            expect(
                loadFromSaveText(JSON.stringify({ tasks: [], taskGroups: 5 }))
            ).toEqual({
                tasks: [],
                taskGroups: []
            });
        });

        test("TaskGroups working", () => {
            const groups = [
                TaskGroup({ id: "id1", name: "Group 1" }),
                TaskGroup({ id: "id2", name: "Group 2" })
            ];

            expect(
                loadFromSaveText(
                    JSON.stringify({
                        tasks: [],
                        taskGroups: [
                            groups[0],
                            {
                                invalid: true
                            },
                            groups[1]
                        ]
                    })
                )
            ).toEqual({
                tasks: [],
                taskGroups: groups
            });
        });
    });
});
