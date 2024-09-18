import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskGroup } from "./TaskGroup";

/**
 * Type representing the state of the TaskGroups slice
 */
type TaskGroupState = {
    groups: TaskGroup[];
}

/**
 * Initial state for the slice
 */
export const initialState: TaskGroupState = {
    groups: [
        {
            name: "First group",
            description: "idk",
            id: "1"
        },

        {
            name: "Second group",
            description: "who knows?",
            id: "2"
        }
    ]
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
        }
    }
});

// Export the actions
export const { addTaskGroup } = taskGroupSlice.actions;

// Export the reducer itself
export default taskGroupSlice.reducer;

// Set up selectors
/**
 * Selects the list of task groups
 * @param state 
 * @returns 
 */
export const selectTaskGroups = (state: TaskGroupState): TaskGroup[] => state.groups;