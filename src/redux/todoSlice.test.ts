import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import reducer, {
    addTask,
    addTaskGroup,
    addTaskPriority,
    addTaskTag,
    initialState,
    removeTaskTag,
    selectActiveTaskGroup,
    selectAllTasks,
    selectTaskGroupNameByID,
    selectTasksInCurrentTaskList,
    selectTaskWithID,
    setActiveTaskGroup,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    setTaskDescription,
    setTaskName,
    setTaskOpen,
    setTaskPriority,
    setTaskTags,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "./todoSlice";

import { describe, expect, test } from "vitest";

describe("todoSlice", () => {
    describe("addTaskGroup", () => {
        test("addTaskGroup adds a task group", () => {
            const state = initialState;

            const taskGroup = TaskGroup({ name: "Test", id: "0" });

            const newState = reducer(state, addTaskGroup(taskGroup));

            expect(newState.groups).toEqual([taskGroup]);
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

            expect(newState2.groups).toEqual([taskGroup1, taskGroup2]);
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

            expect(newState2.groups).toEqual([taskGroup1, taskGroup2]);
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

    describe("selectActiveTaskGroup", () => {
        test("selectActiveTaskGroup finds a task group", () => {
            const taskGroups = [
                TaskGroup({ name: "My group", id: "id1" }),
                TaskGroup({ name: "Next group", id: "id2" })
            ];

            const state = {
                ...initialState,
                groups: taskGroups,
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
                groups: taskGroups,
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
                groups: inputGroups,
                activeTaskGroup: "id1"
            };

            state = reducer(state, setActiveTaskGroupName("My group"));

            expect(state.groups).toEqual(outputGroups);
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
                TaskGroup({ name: "Group 2", description: "My description", id: "id2" })
            ];

            let state = {
                ...initialState,
                groups: inputGroups,
                activeTaskGroup: "id2"
            };

            state = reducer(state, setActiveTaskGroupDescription("My description"));

            expect(state.groups).toEqual(outputGroups);
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

    describe("selectTaskWithID", () => {
        test("selectTaskWithID when task exists", () => {
            const tasks = [
                Task({ name: "Task 1", id: "id1" }),
                Task({ name: "Task 2", id: "id2" })
            ];

            const state = {
                ...initialState,
                tasks
            };

            expect(selectTaskWithID("id2")(state)).toEqual(tasks[1]);
        });

        test("selectTaskWithID when task does not exist", () => {
            const tasks = [
                Task({ name: "Task 1", id: "id1" }),
                Task({ name: "Task 2", id: "id2" })
            ];

            const state = {
                ...initialState,
                tasks
            };

            expect(selectTaskWithID("id3")(state)).toEqual(undefined);
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
                Task({ name: "Task 1", id: "id1", priority: 0, tags: ["My", "Task"] }),
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

    describe("selectTaskGroupNameByID", () => {
        test("selectTaskGroupNameByID when group exists", () => {
            const taskGroups = [
                TaskGroup({ name: "Group 1", id: "id1" }),
                TaskGroup({ name: "Group 2", id: "id2" })
            ];

            const state = {
                ...initialState,
                groups: taskGroups
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
                groups: taskGroups
            };

            expect(selectTaskGroupNameByID("id3")(state)).toBe("");
        });
    });
});
