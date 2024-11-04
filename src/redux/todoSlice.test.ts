import { AppNotification } from "../features/notifications/AppNotification";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import reducer, {
    addTask,
    addTaskGroup,
    addTaskPriority,
    addTaskTag,
    deleteTask,
    deleteTaskGroup,
    getTaskByID,
    initialState,
    moveTaskToGroup,
    moveTaskToUngrouped,
    pushNotification,
    removeNotificationByID,
    removeTasksInGroup,
    removeTaskTag,
    selectActiveTaskGroup,
    selectAllTasks,
    selectSaveData,
    selectTaskGroupNameByID,
    selectTaskIDs,
    selectTasksInCurrentTaskList,
    setActiveTaskGroup,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    setTaskDescription,
    setTaskName,
    setTaskOpen,
    setTaskPriority,
    setTaskTags,
    SortOrder,
    SortParameter,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType,
    TodoState
} from "./todoSlice";

import { describe, expect, test } from "vitest";

describe("todoSlice", () => {
    describe("taskGroups", () => {
        describe("addTaskGroup", () => {
            test("addTaskGroup adds a task group", () => {
                const state = initialState;

                const taskGroup = TaskGroup({ name: "Test", id: "0" });

                const newState = reducer(state, addTaskGroup(taskGroup));

                expect(newState.taskGroups).toEqual([taskGroup]);
            });

            test("addTaskGroup adds multiple task groups", () => {
                const state = initialState;

                const taskGroup1 = TaskGroup({ name: "Test", id: "0" });
                const taskGroup2 = TaskGroup({
                    name: "Test2",
                    description: "Description",
                    id: "1"
                });

                const newState1 = reducer(state, addTaskGroup(taskGroup1));
                const newState2 = reducer(newState1, addTaskGroup(taskGroup2));

                expect(newState2.taskGroups).toEqual([taskGroup1, taskGroup2]);
            });

            test("addTaskGroup updates active task group", () => {
                const state = initialState;

                const taskGroup1 = TaskGroup({ name: "Test", id: "0" });
                const taskGroup2 = TaskGroup({
                    name: "Test2",
                    description: "Description",
                    id: "1"
                });

                const newState1 = reducer(state, addTaskGroup(taskGroup1));
                const newState2 = reducer(newState1, addTaskGroup(taskGroup2));

                expect(newState2.taskGroups).toEqual([taskGroup1, taskGroup2]);
                expect(newState2.activeTaskGroup).toBe("1");
            });

            test("addTaskGroup updates task list type", () => {
                const state = initialState;

                const taskGroup = TaskGroup({ name: "Test", id: "0" });

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

        describe("selectActiveTaskGroup", () => {
            test("selectActiveTaskGroup finds a task group", () => {
                const taskGroups = [
                    TaskGroup({ name: "My group", id: "id1" }),
                    TaskGroup({ name: "Next group", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    taskGroups: taskGroups,
                    activeTaskGroup: "id1"
                };

                expect(selectActiveTaskGroup(state)).toEqual(taskGroups[0]);
            });

            test("selectActiveTaskGroup does not find a task group", () => {
                const taskGroups = [
                    TaskGroup({ name: "My group", id: "id1" }),
                    TaskGroup({ name: "Next group", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    taskGroups: taskGroups,
                    activeTaskGroup: "id3"
                };

                expect(selectActiveTaskGroup(state)).toBe(undefined);
            });
        });

        describe("setActiveTaskGroupName", () => {
            test("setActiveTaskGroupName sets the name of the active task group", () => {
                const inputGroups = [
                    TaskGroup({ name: "Group 1", id: "id1" }),
                    TaskGroup({ name: "Group 2", id: "id2" })
                ];

                const outputGroups = [
                    TaskGroup({ name: "My group", id: "id1" }),
                    TaskGroup({ name: "Group 2", id: "id2" })
                ];

                let state = {
                    ...initialState,
                    taskGroups: inputGroups,
                    activeTaskGroup: "id1"
                };

                state = reducer(state, setActiveTaskGroupName("My group"));

                expect(state.taskGroups).toEqual(outputGroups);
            });
        });

        describe("setActiveTaskGroupDescription", () => {
            test("setActiveTaskGroupDescription sets the description of the active task group", () => {
                const inputGroups = [
                    TaskGroup({ name: "Group 1", id: "id1" }),
                    TaskGroup({ name: "Group 2", id: "id2" })
                ];

                const outputGroups = [
                    TaskGroup({ name: "Group 1", id: "id1" }),
                    TaskGroup({
                        name: "Group 2",
                        description: "My description",
                        id: "id2"
                    })
                ];

                let state = {
                    ...initialState,
                    taskGroups: inputGroups,
                    activeTaskGroup: "id2"
                };

                state = reducer(state, setActiveTaskGroupDescription("My description"));

                expect(state.taskGroups).toEqual(outputGroups);
            });
        });

        describe("selectTaskGroupNameByID", () => {
            test("selectTaskGroupNameByID when group exists", () => {
                const taskGroups = [
                    TaskGroup({ name: "Group 1", id: "id1" }),
                    TaskGroup({ name: "Group 2", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    taskGroups: taskGroups
                };

                expect(selectTaskGroupNameByID("id1")(state)).toBe("Group 1");
            });

            test("selectTaskGroupNameByID when group does not exist", () => {
                const taskGroups = [
                    TaskGroup({ name: "Group 1", id: "id1" }),
                    TaskGroup({ name: "Group 2", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    taskGroups: taskGroups
                };

                expect(selectTaskGroupNameByID("id3")(state)).toBe("");
            });
        });

        describe("deleteTaskGroup", () => {
            test("deleteTaskGroup deletes a task group, preserving the tasks", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "groupID1" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "groupID1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(
                    state,
                    deleteTaskGroup({
                        taskGroupID: "groupID1",
                        preserveTasks: true
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
                expect(state.taskGroups).toEqual([]);
            });

            test("deleteTaskGroup deletes a task group, deleting the tasks", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "groupID1" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const outputTasks = [
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "groupID1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(
                    state,
                    deleteTaskGroup({
                        taskGroupID: "groupID1",
                        preserveTasks: false
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
                expect(state.taskGroups).toEqual([]);
            });

            test("deleteTaskGroup switches to displaying All Tasks", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "groupID1" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "groupID1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(
                    state,
                    deleteTaskGroup({
                        taskGroupID: "groupID1",
                        preserveTasks: false
                    })
                );

                expect(state.taskListType).toEqual(TaskListType.All);
                expect(state.activeTaskGroup).toBe("");
            });
        });

        describe("removeTasksInGroup", () => {
            test("Removes all tasks in the given group", () => {
                const tasks = [
                    Task({ id: "id1", name: "Name" }),
                    Task({ id: "id2", name: "My task", taskGroupID: "gid" }),
                    Task({ id: "id3", name: "My task 2", taskGroupID: "gid2" }),
                    Task({ id: "id4", name: "My task 3", taskGroupID: "gid" })
                ];

                const taskGroups = [
                    TaskGroup({ id: "gid", name: "Group 1" }),
                    TaskGroup({ id: "gid2", name: "Group 2" })
                ];

                let state = {
                    ...initialState,
                    tasks,
                    taskGroups
                };

                state = reducer(state, removeTasksInGroup("gid"));

                expect(state.tasks).toEqual([tasks[0], tasks[2]]);
            });
        });
    });

    describe("tasks", () => {
        describe("addTask", () => {
            test("addTask adds a task", () => {
                let state = initialState;

                const task = Task({
                    name: "My task",
                    id: "id1",
                    taskGroupID: "id1"
                });

                state = reducer(state, addTask(task));

                expect(state.tasks).toEqual([task]);
            });
        });

        describe("selectAllTasks", () => {
            test("selectAllTasks selects all tasks", () => {
                const taskList = [
                    Task({
                        name: "My task",
                        id: "id1",
                        taskGroupID: ""
                    }),

                    Task({
                        name: "My task 2",
                        description: "Why",
                        id: "id2",
                        taskGroupID: "id1",
                        priority: 1
                    }),

                    Task({
                        name: "My task 3",
                        description: "Testing",
                        id: "id3",
                        taskGroupID: "id1",
                        priority: 2
                    }),

                    Task({
                        name: "My task 4",
                        id: "id4",
                        taskGroupID: ""
                    }),

                    Task({
                        name: "My task 5",
                        id: "id5",
                        taskGroupID: "id3",
                        priority: -1
                    })
                ];

                const state = {
                    ...initialState,
                    tasks: taskList
                };

                expect(selectAllTasks(state)).toEqual(taskList);
            });
        });

        describe("selectTasksInCurrentTaskList", () => {
            describe("No sorting or filtering", () => {
                test("selectTasksInCurrentTaskList with all tasks", () => {
                    const taskList = [
                        Task({
                            name: "My task",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 2",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "My task 3",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "My task 4",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 5",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
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
                        Task({
                            name: "My task",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 2",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "My task 3",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "My task 4",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 5",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
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
                        Task({
                            name: "My task",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 2",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "My task 3",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "My task 4",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "My task 5",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
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
            describe("Sorting by name ascending", () => {
                test("selectTasksInCurrentTaskList with all tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.All,
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[3],
                        taskList[1],
                        taskList[0],
                        taskList[2],
                        taskList[4]
                    ]);
                });

                test("selectTasksInCurrentTaskList with ungrouped tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.Ungrouped,
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[3],
                        taskList[0]
                    ]);
                });

                test("selectTasksInCurrentTaskList with an active task group", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.TaskGroup,
                        activeTaskGroup: "id1",
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[1],
                        taskList[2]
                    ]);
                });
            });
            describe("Sorting by name descending", () => {
                test("selectTasksInCurrentTaskList with all tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.All,
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[4],
                        taskList[2],
                        taskList[0],
                        taskList[1],
                        taskList[3]
                    ]);
                });

                test("selectTasksInCurrentTaskList with ungrouped tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.Ungrouped,
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[0],
                        taskList[3]
                    ]);
                });

                test("selectTasksInCurrentTaskList with an active task group", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: ""
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.TaskGroup,
                        activeTaskGroup: "id1",
                        taskSortParam: SortParameter.Name,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[2],
                        taskList[1]
                    ]);
                });
            });
            describe("Sorting by priority ascending", () => {
                test("selectTasksInCurrentTaskList with all tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.All,
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[3],
                        taskList[4],
                        taskList[0],
                        taskList[1],
                        taskList[2]
                    ]);
                });

                test("selectTasksInCurrentTaskList with ungrouped tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.Ungrouped,
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[3],
                        taskList[0]
                    ]);
                });

                test("selectTasksInCurrentTaskList with an active task group", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.TaskGroup,
                        activeTaskGroup: "id1",
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Ascending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[1],
                        taskList[2]
                    ]);
                });
            });
            describe("Sorting by priority descending", () => {
                test("selectTasksInCurrentTaskList with all tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.All,
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[2],
                        taskList[1],
                        taskList[0],
                        taskList[4],
                        taskList[3]
                    ]);
                });

                test("selectTasksInCurrentTaskList with ungrouped tasks", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.Ungrouped,
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[0],
                        taskList[3]
                    ]);
                });

                test("selectTasksInCurrentTaskList with an active task group", () => {
                    const taskList = [
                        Task({
                            name: "D",
                            id: "id1",
                            taskGroupID: "",
                            priority: 0
                        }),

                        Task({
                            name: "C",
                            description: "Why",
                            id: "id2",
                            taskGroupID: "id1",
                            priority: 1
                        }),

                        Task({
                            name: "E",
                            description: "Testing",
                            id: "id3",
                            taskGroupID: "id1",
                            priority: 2
                        }),

                        Task({
                            name: "A",
                            id: "id4",
                            taskGroupID: "",
                            priority: -4
                        }),

                        Task({
                            name: "F",
                            id: "id5",
                            taskGroupID: "id3",
                            priority: -1
                        })
                    ];

                    const state = {
                        ...initialState,
                        tasks: taskList,
                        taskListType: TaskListType.TaskGroup,
                        activeTaskGroup: "id1",
                        taskSortParam: SortParameter.Priority,
                        taskSortOrder: SortOrder.Descending
                    };

                    expect(selectTasksInCurrentTaskList(state)).toEqual([
                        taskList[2],
                        taskList[1]
                    ]);
                });
            });
        });

        describe("setTaskName", () => {
            test("setTaskName sets the name of the given task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "My Task", id: "id2" })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskName({
                        taskID: "id2",
                        name: "My Task"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("getTaskByID", () => {
            test("getTaskByID when task exists", () => {
                const tasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    tasks
                };

                expect(getTaskByID("id2")(state)).toEqual(tasks[1]);
            });

            test("getTaskByID when task does not exist", () => {
                const tasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const state = {
                    ...initialState,
                    tasks
                };

                expect(() => getTaskByID("id3")(state)).toThrowError(
                    "Task with ID id3 not found!"
                );
            });
        });

        describe("setTaskDescription", () => {
            test("setTaskDescription sets the description of the given task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", description: "My description", id: "id2" })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskDescription({
                        taskID: "id2",
                        description: "My description"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("setTaskOpen", () => {
            test("setTaskOpen sets a task to be open", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2", isOpen: true })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskOpen({
                        taskID: "id2",
                        open: true
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });

            test("setTaskOpen sets a task to be closed", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2", isOpen: true })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2", isOpen: false })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskOpen({
                        taskID: "id2",
                        open: false
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("setTaskPriority", () => {
            test("setTaskPriority sets the priority of the given task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 0 }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 5 }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskPriority({
                        taskID: "id1",
                        priority: 5
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("addTaskPriority", () => {
            test("addTaskPriority adds to the priority of the given task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 3 }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 8 }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    addTaskPriority({
                        taskID: "id1",
                        priority: 5
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("addTaskTag", () => {
            test("addTaskTag adds a tag to a task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 0, tags: [] }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 0, tags: ["Tag"] }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    addTaskTag({
                        taskID: "id1",
                        tag: "Tag"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });

            test("addTaskTag does not add a tag if the task already has it", () => {
                const inputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["Tag A", "Tag B"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["Tag A", "Tag B"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    addTaskTag({
                        taskID: "id1",
                        tag: "Tag A"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("removeTaskTag", () => {
            test("removeTaskTag removes a tag from a task", () => {
                const inputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["Tag A", "Tag B"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 0, tags: ["Tag A"] }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    removeTaskTag({
                        taskID: "id1",
                        tag: "Tag B"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });

            test("removeTaskTag does not remove a tag because it is not present", () => {
                const inputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["Tag A", "Tag B"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["Tag A", "Tag B"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    removeTaskTag({
                        taskID: "id1",
                        tag: "Tag C"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("setTaskTags", () => {
            test("setTaskTags sets the tags for a task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", priority: 0, tags: [] }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                const outputTasks = [
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 0,
                        tags: ["My", "Task"]
                    }),
                    Task({ name: "Task 2", id: "id2", priority: 0 })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(
                    state,
                    setTaskTags({
                        taskID: "id1",
                        tags: ["My", "Task"]
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("deleteTask", () => {
            test("deleteTask deletes a task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1" }),
                    Task({ name: "Task 2", id: "id2" })
                ];

                const outputTasks = [Task({ name: "Task 2", id: "id2" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks
                };

                state = reducer(state, deleteTask("id1"));

                expect(state.tasks).toEqual(outputTasks);
            });
        });

        describe("moveTaskToUngrouped", () => {
            test("moveTaskToUngrouped already ungrouped", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "gid1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(state, moveTaskToUngrouped("id1"));

                expect(state.tasks).toEqual(outputTasks);
            });

            test("moveTaskToUngrouped with a grouped task", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "gid1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(state, moveTaskToUngrouped("id2"));

                expect(state.tasks).toEqual(outputTasks);
            });

            test("moveTaskToUngrouped does not change task list if in all tasks", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "gid1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups,
                    taskListType: TaskListType.All
                };

                state = reducer(state, moveTaskToUngrouped("id1"));

                expect(state.taskListType).toEqual(TaskListType.All);
            });

            test("moveTaskToUngrouped does not change task list if in ungrouped tasks", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "gid1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups,
                    taskListType: TaskListType.Ungrouped
                };

                state = reducer(state, moveTaskToUngrouped("id1"));

                expect(state.taskListType).toEqual(TaskListType.Ungrouped);
            });

            test("moveTaskToUngrouped does change task list to ungrouped if in a task group", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [TaskGroup({ name: "Group 1", id: "gid1" })];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups,
                    taskListType: TaskListType.Ungrouped,
                    activeTaskGroup: "gid1"
                };

                state = reducer(state, moveTaskToUngrouped("id1"));

                expect(state.taskListType).toEqual(TaskListType.Ungrouped);
                expect(state.activeTaskGroup).toBe("");
            });
        });

        describe("moveTaskToGroup", () => {
            test("moveTaskToGroup from ungrouped", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "gid2" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [
                    TaskGroup({ name: "Group 1", id: "gid1" }),
                    TaskGroup({ name: "Group 2", id: "gid2" })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(
                    state,
                    moveTaskToGroup({
                        id: "id1",
                        groupID: "gid2"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
                expect(state.activeTaskGroup).toBe("gid2");
                expect(state.taskListType).toEqual(TaskListType.TaskGroup);
            });

            test("moveTaskToGroup from other group", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid2" })
                ];

                const taskGroups = [
                    TaskGroup({ name: "Group 1", id: "gid1" }),
                    TaskGroup({ name: "Group 2", id: "gid2" })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups
                };

                state = reducer(
                    state,
                    moveTaskToGroup({
                        id: "id2",
                        groupID: "gid2"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
                expect(state.activeTaskGroup).toBe("gid2");
                expect(state.taskListType).toEqual(TaskListType.TaskGroup);
            });

            test("moveTaskToGroup from same group", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const outputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const taskGroups = [
                    TaskGroup({ name: "Group 1", id: "gid1" }),
                    TaskGroup({ name: "Group 2", id: "gid2" })
                ];

                let state = {
                    ...initialState,
                    tasks: inputTasks,
                    taskGroups: taskGroups,
                    taskListType: TaskListType.TaskGroup,
                    activeTaskGroup: "gid1"
                };

                state = reducer(
                    state,
                    moveTaskToGroup({
                        id: "id2",
                        groupID: "gid1"
                    })
                );

                expect(state.tasks).toEqual(outputTasks);
                expect(state.activeTaskGroup).toBe("gid1");
                expect(state.taskListType).toEqual(TaskListType.TaskGroup);
            });
        });

        describe("selectTaskIDs", () => {
            test("selectTaskIDs", () => {
                const inputTasks = [
                    Task({ name: "Task 1", id: "id1", taskGroupID: "" }),
                    Task({ name: "Task 2", id: "id2", taskGroupID: "gid1" })
                ];

                const state = {
                    ...initialState,
                    tasks: inputTasks
                };

                expect(selectTaskIDs(state)).toEqual(["id1", "id2"]);
            });
        });
    });

    describe("notifications", () => {
        describe("pushNotification", () => {
            test("pushNotification onto empty array", () => {
                let state: TodoState = { ...initialState, notifications: [] };

                const notif = AppNotification({ text: "Saved", id: "id1" });

                state = reducer(state, pushNotification(notif));

                expect(state.notifications).toEqual([notif]);
            });

            test("pushNotification onto array with elements", () => {
                const notif1 = AppNotification({ text: "Mine", id: "id1" });
                const notif2 = AppNotification({ text: "Ok", id: "id2" });

                let state = { ...initialState, notifications: [notif1] };

                state = reducer(state, pushNotification(notif2));

                expect(state.notifications).toEqual([notif1, notif2]);
            });
        });

        describe("removeNotificationByID", () => {
            test("removeNotificationByID empty array", () => {
                let state: TodoState = { ...initialState, notifications: [] };

                state = reducer(state, removeNotificationByID("id1"));

                expect(state.notifications).toEqual([]);
            });

            test("removeNotificationByID array with elements", () => {
                const notifs = [
                    AppNotification({ text: "a", id: "id1" }),
                    AppNotification({ text: "b", id: "id2" }),
                    AppNotification({ text: "c", id: "id3" })
                ];

                let state = { ...initialState, notifications: notifs };

                state = reducer(state, removeNotificationByID("id2"));

                expect(state.notifications).toEqual([notifs[0], notifs[2]]);
            });

            test("removeNotificationByID array with elements, target not present", () => {
                const notifs = [
                    AppNotification({ text: "a", id: "id1" }),
                    AppNotification({ text: "b", id: "id2" }),
                    AppNotification({ text: "c", id: "id3" })
                ];

                let state = { ...initialState, notifications: notifs };

                state = reducer(state, removeNotificationByID("id4"));

                expect(state.notifications).toEqual(notifs);
            });
        });
    });

    describe("selectSaveData", () => {
        test("selectSaveData gets the save data", () => {
            const state: TodoState = {
                ...initialState,
                taskGroups: [TaskGroup({ id: "id1", name: "My group" })],
                tasks: [
                    Task({
                        id: "id2",
                        name: "My task"
                    })
                ]
            };

            const saveData = selectSaveData(state);

            // Parsing the save data seems to be my best bet here to deal with uncertain order, because the save data is valid JSON
            expect(JSON.parse(saveData)).toStrictEqual({
                taskGroups: [
                    {
                        id: "id1",
                        name: "My group",
                        description: ""
                    }
                ],

                tasks: [
                    {
                        id: "id2",
                        name: "My task",
                        description: "",
                        taskGroupID: "",
                        priority: 0,
                        tags: []
                    }
                ]
            });
        });
    });
});
