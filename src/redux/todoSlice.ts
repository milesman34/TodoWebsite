import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { Task } from "../features/tasks/Task";
import { filterMap } from "../utils/utils";

/**
 * Represents what type of task list is being viewed
 */
export enum TaskListType {
    All,
    Ungrouped,
    TaskGroup
}

/**
 * Type representing the state of the Todo slice
 */
type TodoState = {
    // List of task groups
    groups: TaskGroup[];

    // Active task group is an ID
    activeTaskGroup: string;

    // Type of task collection being viewed
    taskListType: TaskListType;

    // List of tasks
    tasks: Task[];
};

/**
 * Initial state for the slice
 */
export const initialState: TodoState = {
    groups: [],
    activeTaskGroup: "",
    taskListType: TaskListType.All,
    tasks: []
};

// Todo slice handles tasks and task groups
const todoSlice = createSlice({
    name: "taskGroups",

    initialState,

    reducers: {
        /**
         * Adds a task group to the list of task groups
         * @param state
         * @param action
         * @returns
         */
        addTaskGroup(state: TodoState, action: PayloadAction<TaskGroup>) {
            state.groups.push(action.payload);

            // Set the active task group
            state.activeTaskGroup = action.payload.id;

            // Update the task list type
            state.taskListType = TaskListType.TaskGroup;
        },

        /**
         * Sets the current task group ID
         * @param state
         * @param action
         */
        setActiveTaskGroup(state: TodoState, action: PayloadAction<string>) {
            state.activeTaskGroup = action.payload;

            state.taskListType =
                action.payload === "" ? TaskListType.All : TaskListType.TaskGroup;
        },

        /**
         * Sets the list of groups
         * @param state
         * @param action
         */
        setGroups(state: TodoState, action: PayloadAction<TaskGroup[]>) {
            state.groups = action.payload;
        },

        /**
         * Switches to displaying all tasks
         * @param state
         */
        switchToAllTasks(state: TodoState) {
            state.taskListType = TaskListType.All;
            state.activeTaskGroup = "";
        },

        /**
         * Switches to displaying ungrouped tasks
         * @param state
         */
        switchToUngroupedTasks(state: TodoState) {
            state.taskListType = TaskListType.Ungrouped;
            state.activeTaskGroup = "";
        },

        /**
         * Adds a task to the list of tasks
         * @param state
         * @param action
         * @returns
         */
        addTask(state: TodoState, action: PayloadAction<Task>) {
            state.tasks.push(action.payload);
        },

        /**
         * Sets the list of tasks (mainly designed for testing)
         * @param state
         * @param action
         * @returns
         */
        setTasks(state: TodoState, action: PayloadAction<Task[]>) {
            state.tasks = action.payload;
        },

        /**
         * Changes the name of the active task group
         */
        setActiveTaskGroupName(state: TodoState, action: PayloadAction<string>) {
            state.groups = filterMap(
                state.groups,
                (group) => group.id === state.activeTaskGroup,
                (group) => ({ ...group, name: action.payload })
            );
        },

        /**
         * Changes the description of the active task group
         */
        setActiveTaskGroupDescription(state: TodoState, action: PayloadAction<string>) {
            state.groups = filterMap(
                state.groups,
                (group) => group.id === state.activeTaskGroup,
                (group) => ({ ...group, description: action.payload })
            );
        },

        /**
         * Sets the name of a task
         * @param state
         * @param action payload containing the ID of the task and the new name
         */
        setTaskName(
            state: TodoState,
            action: PayloadAction<{
                taskID: string;
                name: string;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    name: action.payload.name
                })
            );
        },

        /**
         * Sets the description of a task
         * @param state
         * @param action payload containing the ID of the task and the new description
         */
        setTaskDescription(
            state: TodoState,
            action: PayloadAction<{
                taskID: string;
                description: string;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    description: action.payload.description
                })
            );
        },

        /**
         * Sets if a task is open or not
         */
        setTaskOpen(
            state: TodoState,
            action: PayloadAction<{
                taskID: string;
                open: boolean;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    isOpen: action.payload.open
                })
            );
        },

        /**
         * Sets the priority of a task
         */
        setTaskPriority(
            state: TodoState,
            action: PayloadAction<{
                taskID: string;
                priority: number;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    priority: action.payload.priority
                })
            );
        },

        /**
         * Adds to the priority of a task
         */
        addTaskPriority(
            state: TodoState,
            action: PayloadAction<{
                taskID: string;
                priority: number;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    priority: task.priority + action.payload.priority
                })
            );
        },

        /**
         * Adds a tag to a task if it does not already exist
         */
        addTaskTag(
            state: TodoState,
            action: PayloadAction<{ taskID: string; tag: string }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    tags: task.tags.includes(action.payload.tag)
                        ? task.tags
                        : [...task.tags, action.payload.tag]
                })
            );
        },

        /**
         * Removes a tag from a task
         */
        removeTaskTag(
            state: TodoState,
            action: PayloadAction<{ taskID: string; tag: string }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    tags: task.tags.filter((tag) => tag !== action.payload.tag)
                })
            );
        },

        /**
         * Sets the tags for the task
         */
        setTaskTags(
            state: TodoState,
            action: PayloadAction<{ taskID: string; tags: string[] }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.taskID,
                (task) => ({
                    ...task,
                    tags: action.payload.tags
                })
            );
        },

        /**
         * Deletes a task group. If the preserveTasks option is enabled then it keeps the tasks, otherwise deleting them
         */
        deleteTaskGroup(
            state: TodoState,
            action: PayloadAction<{
                taskGroupID: string;
                preserveTasks: boolean;
            }>
        ) {
            state.groups = state.groups.filter(
                (taskGroup) => taskGroup.id !== action.payload.taskGroupID
            );

            if (action.payload.preserveTasks) {
                // Set all the tasks in the task group to be ungrouped
                state.tasks = filterMap(
                    state.tasks,
                    (task) => task.taskGroupID === action.payload.taskGroupID,
                    (task) => ({
                        ...task,
                        taskGroupID: ""
                    })
                );
            } else {
                // Delete all tasks in the task group
                state.tasks = state.tasks.filter(
                    (task) => task.taskGroupID !== action.payload.taskGroupID
                );
            }

            // Switch to All Tasks
            state.taskListType = TaskListType.All;
            state.activeTaskGroup = "";
        },

        /**
         * Deletes a task
         */
        deleteTask(state: TodoState, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },

        /**
         * Moves a task to ungrouped tasks
         */
        moveTaskToUngrouped(state: TodoState, action: PayloadAction<string>) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload,
                (task) => ({
                    ...task,
                    taskGroupID: ""
                })
            );

            if (state.taskListType !== TaskListType.All) {
                state.taskListType = TaskListType.Ungrouped;
                state.activeTaskGroup = "";
            }
        },

        /**
         * Moves a task to a given task group
         */
        moveTaskToGroup(
            state: TodoState,
            action: PayloadAction<{
                id: string;
                groupID: string;
            }>
        ) {
            state.tasks = filterMap(
                state.tasks,
                (task) => task.id === action.payload.id,
                (task) => ({
                    ...task,
                    taskGroupID: action.payload.groupID
                })
            );

            // Change the active task group
            state.taskListType = TaskListType.TaskGroup;
            state.activeTaskGroup = action.payload.groupID;
        }
    }
});

// Export the actions
export const {
    addTask,
    addTaskGroup,
    addTaskPriority,
    addTaskTag,
    deleteTask,
    deleteTaskGroup,
    moveTaskToGroup,
    moveTaskToUngrouped,
    removeTaskTag,
    setActiveTaskGroup,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    setGroups,
    setTaskDescription,
    setTaskName,
    setTaskOpen,
    setTaskPriority,
    setTaskTags,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} = todoSlice.actions;

// Export the reducer itself
export default todoSlice.reducer;

// Set up selectors
/**
 * Selects the list of task groups
 * @param state
 * @returns
 */
export const selectTaskGroups = (state: TodoState): TaskGroup[] => state.groups;

/**
 * Selects the active task group (ID)
 * @param state
 * @returns
 */
export const selectActiveTaskGroupID = (state: TodoState): string =>
    state.activeTaskGroup;

/**
 * Searches for a task group matching the active task group ID, returning undefined if it does not exist
 * @param state
 * @returns
 */
export const selectActiveTaskGroup = (state: TodoState): TaskGroup | undefined =>
    state.groups.find((taskGroup) => taskGroup.id === state.activeTaskGroup);

/**
 * Selects the list of all tasks
 * @param state
 * @returns
 */
export const selectAllTasks = (state: TodoState): Task[] => state.tasks;

/**
 * Returns the current task list type
 * @param state
 * @returns
 */
export const selectTaskListType = (state: TodoState): TaskListType => state.taskListType;

/**
 * Returns all of the tasks currently visible based on the task list type
 */
export const selectTasksInCurrentTaskList = createSelector(
    [selectTaskListType, selectAllTasks, selectActiveTaskGroupID],
    (taskListType, tasks, activeTaskGroupID) => {
        switch (taskListType) {
            case TaskListType.All:
                return tasks;

            case TaskListType.Ungrouped:
                return tasks.filter((task) => task.taskGroupID === "");

            case TaskListType.TaskGroup:
                return tasks.filter((task) => task.taskGroupID === activeTaskGroupID);
        }
    }
);

/**
 * Returns the task with the given ID if it exists, returning undefined otherwise
 * @param id ID to search for
 */
export const selectTaskWithID =
    (id: string) =>
    (state: TodoState): Task | undefined =>
        state.tasks.find((task) => task.id === id);

/**
 * Returns the name of the task group with the given ID if it exists, or the empty string otherwise
 * @param id ID to search for
 */
export const selectTaskGroupNameByID =
    (id: string) =>
    (state: TodoState): string => {
        const targetGroup = state.groups.find((taskGroup) => taskGroup.id === id);

        return targetGroup === undefined ? "" : targetGroup.name;
    };

/**
 * Selects the ids of all tasks
 */
export const selectTaskIDs = createSelector([selectAllTasks], (tasks) =>
    tasks.map((task) => task.id)
);

/**
 * Selects the ids of all open tasks
 */
export const selectOpenTaskIDs = createSelector([selectAllTasks], (tasks) =>
    tasks.filter((task) => task.isOpen).map((task) => task.id)
);
