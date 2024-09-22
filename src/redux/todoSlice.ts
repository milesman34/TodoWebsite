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

    // Active task is an ID
    activeTask: string;
};

/**
 * Initial state for the slice
 */
export const initialState: TodoState = {
    groups: [],
    activeTaskGroup: "",
    taskListType: TaskListType.All,
    tasks: [],
    activeTask: ""
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

            state.activeTask = action.payload.id;
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
        }
    }
});

// Export the actions
export const {
    addTask,
    addTaskGroup,
    setActiveTaskGroup,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    setGroups,
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
