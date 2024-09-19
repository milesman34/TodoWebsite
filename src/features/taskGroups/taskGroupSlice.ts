import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskGroup } from "./TaskGroup";

/**
 * Type representing the state of the TaskGroups slice
 */
type TaskGroupState = {
    groups: TaskGroup[];

    // Active task group is an ID
    activeTaskGroup: string;
};

/**
 * Initial state for the slice
 */
export const initialState: TaskGroupState = {
    groups: [],
    activeTaskGroup: ""
};

// TaskGroup slice handles groups of tasks
const taskGroupSlice = createSlice({
    name: "taskGroups",

    initialState,

    reducers: {
        /**
         * Adds a task group to the list of task groups
         * @param state
         * @param action
         * @returns
         */
        addTaskGroup(state: TaskGroupState, action: PayloadAction<TaskGroup>) {
            state.groups.push(action.payload);

            // Set the active task group
            state.activeTaskGroup = action.payload.id;
        },

        /**
         * Sets the current task group ID
         * @param state
         * @param action
         */
        setActiveTaskGroup(state: TaskGroupState, action: PayloadAction<string>) {
            state.activeTaskGroup = action.payload;
        },

        /**
         * Sets the list of groups
         * @param state
         * @param action
         */
        setGroups(state: TaskGroupState, action: PayloadAction<TaskGroup[]>) {
            state.groups = action.payload;
        }
    }
});

// Export the actions
export const { addTaskGroup, setActiveTaskGroup, setGroups } = taskGroupSlice.actions;

// Export the reducer itself
export default taskGroupSlice.reducer;

// Set up selectors
/**
 * Selects the list of task groups
 * @param state
 * @returns
 */
export const selectTaskGroups = (state: TaskGroupState): TaskGroup[] => state.groups;

/**
 * Selects the active task group (ID)
 * @param state
 * @returns
 */
export const selectActiveTaskGroup = (state: TaskGroupState): string =>
    state.activeTaskGroup;
