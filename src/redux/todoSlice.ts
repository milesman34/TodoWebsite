import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppNotification } from "../features/notifications/AppNotification";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { formatTaskForStorage, Task } from "../features/tasks/Task";
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
 * Represents the current page being viewed
 */
export enum AppPage {
    Main,
    ManageSave
}

/**
 * Represents the current modal being viewed
 */
export enum Modal {
    None,
    ExportSave,
    ImportSave,
    FilterTasks
}

/**
 * Represents the way tasks are being sorted
 */
export enum SortParameter {
    None,
    Name,
    Priority
}

/**
 * Represents the order of sorting
 */
export enum SortOrder {
    Ascending,
    Descending
}

/**
 * Represents a comparison operator for filtering
 */
export enum Operator {
    None, // No filtering based on priority
    Equals,
    NotEquals,
    LessThan,
    GreaterThan,
    LessOrEqual,
    GreaterOrEqual
}

/**
 * Represents the filter settings for the app
 */
export type FilterSettings = {
    // What name should be searched for? (empty means don't filter by name)
    name: string;

    // What description should be searched for? (empty means don't filter by description)
    description: string;

    // What should be the priority threshold for filtering?
    priorityThreshold: number;

    // What should be the operator used for priority filtering?
    priorityOperator: Operator;

    // Tags to filter by
    tags: string[];
};

/**
 * Type representing the state of the Todo slice
 */
export type TodoState = {
    // List of task groups
    taskGroups: TaskGroup[];

    // Active task group is an ID
    activeTaskGroup: string;

    // Type of task collection being viewed
    taskListType: TaskListType;

    // List of tasks
    tasks: Task[];

    // List of notifications
    // It seems important for there to be an ID for the notification
    notifications: AppNotification[];

    // Which page is currently being viewed?
    currentPage: AppPage;

    // Current type of the active modal?
    activeModal: Modal;

    // Current parameter for sorting tasks
    taskSortParam: SortParameter;

    // Current order for sorting tasks
    taskSortOrder: SortOrder;

    // Settings for task filtering
    filterSettings: FilterSettings;
};

/**
 * Initial state for the slice
 */
export const initialState: TodoState = {
    taskGroups: [],
    activeTaskGroup: "",
    taskListType: TaskListType.All,
    tasks: [],
    notifications: [],
    currentPage: AppPage.Main,
    activeModal: Modal.None,
    taskSortParam: SortParameter.None,
    taskSortOrder: SortOrder.Ascending,
    filterSettings: {
        name: "",
        description: "",
        priorityThreshold: 0,
        priorityOperator: Operator.None,
        tags: []
    }
};

// Todo slice handles tasks and task groups
const todoSlice = createSlice({
    name: "taskGroups",

    initialState,

    reducers: {
        // #region taskGroups
        /**
         * Adds a task group to the list of task groups
         * @param state
         * @param action
         * @returns
         */
        addTaskGroup(state: TodoState, action: PayloadAction<TaskGroup>) {
            state.taskGroups.push(action.payload);

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
        setTaskGroups(state: TodoState, action: PayloadAction<TaskGroup[]>) {
            state.taskGroups = action.payload;
        },

        /**
         * Changes the name of the active task group
         */
        setActiveTaskGroupName(state: TodoState, action: PayloadAction<string>) {
            state.taskGroups = filterMap(
                state.taskGroups,
                (group) => group.id === state.activeTaskGroup,
                (group) => ({ ...group, name: action.payload })
            );
        },

        /**
         * Changes the description of the active task group
         */
        setActiveTaskGroupDescription(state: TodoState, action: PayloadAction<string>) {
            state.taskGroups = filterMap(
                state.taskGroups,
                (group) => group.id === state.activeTaskGroup,
                (group) => ({ ...group, description: action.payload })
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
            state.taskGroups = state.taskGroups.filter(
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
         * Removes all tasks in a task group
         */
        removeTasksInGroup(state: TodoState, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter(
                (task) => task.taskGroupID !== action.payload
            );
        },

        // #endregion

        // #region tasks
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
        },

        // #endregion

        // #region mainUI
        /**
         * Sets the current app page
         */
        setCurrentPage(state: TodoState, action: PayloadAction<AppPage>) {
            state.currentPage = action.payload;
        },

        // #endregion

        // #region notifications
        /**
         * Pushes a notification onto the stack
         */
        pushNotification(state: TodoState, action: PayloadAction<AppNotification>) {
            state.notifications.push(action.payload);
        },

        /**
         * Removes the notification with the given ID
         */
        removeNotificationByID(state: TodoState, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (notif) => notif.id !== action.payload
            );
        },

        // #endregion

        // #region modals
        /**
         * Sets the current active modal
         */
        setActiveModal(state: TodoState, action: PayloadAction<Modal>) {
            state.activeModal = action.payload;
        },

        // #endregion

        // #region sorting
        /**
         * Sets the current task sort parameter
         */
        setTaskSortParam(state: TodoState, action: PayloadAction<SortParameter>) {
            state.taskSortParam = action.payload;
        },

        /**
         * Sets the current task sort order
         */
        setTaskSortOrder(state: TodoState, action: PayloadAction<SortOrder>) {
            state.taskSortOrder = action.payload;
        },

        // #endregion

        // #region filtering

        /**
         * Resets the filter settings
         */
        resetFilters(state: TodoState) {
            state.filterSettings.name = "";
            state.filterSettings.description = "";
            state.filterSettings.priorityThreshold = 0;
            state.filterSettings.priorityOperator = Operator.None;
            state.filterSettings.tags = [];
        },

        /**
         * Sets the name to filter by
         */
        setFilterName(state: TodoState, action: PayloadAction<string>) {
            state.filterSettings.name = action.payload;
        },

        /**
         * Sets the description to filter by
         */
        setFilterDescription(state: TodoState, action: PayloadAction<string>) {
            state.filterSettings.description = action.payload;
        },

        /**
         * Sets the priority threshold to filter by
         */
        setFilterPriorityThreshold(state: TodoState, action: PayloadAction<number>) {
            state.filterSettings.priorityThreshold = action.payload;
        },

        /**
         * Sets the priority operator for filtering
         */
        setFilterPriorityOperator(state: TodoState, action: PayloadAction<Operator>) {
            state.filterSettings.priorityOperator = action.payload;
        },

        /**
         * Sets the tags for filtering
         */
        setFilterTags(state: TodoState, action: PayloadAction<string[]>) {
            state.filterSettings.tags = action.payload;
        },

        /**
         * Adds a tag to the filter
         */
        addFilterTag(state: TodoState, action: PayloadAction<string>) {
            if (!state.filterSettings.tags.includes(action.payload))
                state.filterSettings.tags.push(action.payload);
        },

        /**
         * Removes a tag from the filter
         */
        removeFilterTag(state: TodoState, action: PayloadAction<string>) {
            state.filterSettings.tags = state.filterSettings.tags.filter(
                (tag) => tag !== action.payload
            );
        }

        // #endregion
    }
});

// Export the actions
export const {
    addFilterTag,
    addTask,
    addTaskGroup,
    addTaskPriority,
    addTaskTag,
    deleteTask,
    deleteTaskGroup,
    moveTaskToGroup,
    moveTaskToUngrouped,
    pushNotification,
    removeFilterTag,
    removeNotificationByID,
    removeTasksInGroup,
    removeTaskTag,
    resetFilters,
    setActiveModal,
    setActiveTaskGroup,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    setCurrentPage,
    setFilterDescription,
    setFilterName,
    setFilterPriorityOperator,
    setFilterPriorityThreshold,
    setFilterTags,
    setTaskDescription,
    setTaskGroups,
    setTaskName,
    setTaskOpen,
    setTaskPriority,
    setTaskSortOrder,
    setTaskSortParam,
    setTaskTags,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} = todoSlice.actions;

// Export the reducer itself
export default todoSlice.reducer;

// Set up selectors
// #region sorting
/**
 * Selects the current task sort parameter
 */
export const selectTaskSortParam = (state: TodoState): SortParameter =>
    state.taskSortParam;

/**
 * Selects the current task sort order
 */
export const selectTaskSortOrder = (state: TodoState): SortOrder => state.taskSortOrder;

// #endregion

// #region filtering
/**
 * Returns the name to filter by
 */
export const selectFilterName = (state: TodoState): string => state.filterSettings.name;

/**
 * Returns the description to filter by
 */
export const selectFilterDescription = (state: TodoState): string =>
    state.filterSettings.description;

/**
 * Returns the priority threshold to filter by
 */
export const selectFilterPriorityThreshold = (state: TodoState): number =>
    state.filterSettings.priorityThreshold;

/**
 * Returns the priority operator to filter with
 */
export const selectFilterPriorityOperator = (state: TodoState): Operator =>
    state.filterSettings.priorityOperator;

/**
 * Returns the tags to filter with
 */
export const selectFilterTags = (state: TodoState): string[] => state.filterSettings.tags;

/**
 * Returns the full filter settings
 */
export const selectFilterSettings = (state: TodoState): FilterSettings =>
    state.filterSettings;

/**
 * Returns if the filters are default or not
 */
export const selectFiltersAreDefault = createSelector(
    [
        selectFilterName,
        selectFilterDescription,
        selectFilterPriorityOperator,
        selectFilterTags
    ],
    (name, description, priorityOperator, tags) => {
        return (
            name === "" &&
            description === "" &&
            priorityOperator === Operator.None &&
            tags.length === 0
        );
    }
);

// #endregion

// #region taskGroups
/**
 * Selects the list of task groups
 * @param state
 * @returns
 */
export const selectTaskGroups = (state: TodoState): TaskGroup[] => state.taskGroups;

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
    state.taskGroups.find((taskGroup) => taskGroup.id === state.activeTaskGroup);

/**
 * Returns the name of the task group with the given ID if it exists, or the empty string otherwise
 * @param id ID to search for
 */
export const selectTaskGroupNameByID =
    (id: string) =>
    (state: TodoState): string => {
        const targetGroup = state.taskGroups.find((taskGroup) => taskGroup.id === id);

        return targetGroup === undefined ? "" : targetGroup.name;
    };

// #endregion

// #region tasks

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

// Gets the list of tasks to use (as a helper for selectTasksInCurrentTaskList)
const tasksInCurrentTaskList = (
    taskListType: TaskListType,
    tasks: Task[],
    taskGroupID: string
): Task[] => {
    switch (taskListType) {
        case TaskListType.All:
            return tasks;

        case TaskListType.Ungrouped:
            return tasks.filter((task) => task.taskGroupID === "");

        case TaskListType.TaskGroup:
            return tasks.filter((task) => task.taskGroupID === taskGroupID);
    }
};

/**
 * Counts the number of total tasks in the active task list, w/o
 */
export const selectCountTotalTasksInList = createSelector(
    [selectTaskListType, selectAllTasks, selectActiveTaskGroupID],
    (taskListType, tasks, activeTaskGroupID) =>
        tasksInCurrentTaskList(taskListType, tasks, activeTaskGroupID).length
);

// Maps an operator to a corresponding test function
type TestFunction = (a: number, b: number) => boolean;

const operatorMap: Record<Operator, TestFunction> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [Operator.None]: (_a, _b) => true,
    [Operator.Equals]: (a, b) => a === b,
    [Operator.NotEquals]: (a, b) => a !== b,
    [Operator.LessThan]: (a, b) => a < b,
    [Operator.GreaterThan]: (a, b) => a > b,
    [Operator.LessOrEqual]: (a, b) => a <= b,
    [Operator.GreaterOrEqual]: (a, b) => a >= b
};

// Filters the tasks based on the filter settings (as a helper for selectTasksInCurrentTaskList)
const filterTasksWithSettings = (tasks: Task[], settings: FilterSettings): Task[] => {
    const lowerName = settings.name.toLowerCase().trim();
    const lowerDesc = settings.description.toLowerCase().trim();

    return tasks.filter(
        (task) =>
            task.name.toLowerCase().includes(lowerName) &&
            task.description.toLowerCase().includes(lowerDesc) &&
            operatorMap[settings.priorityOperator](
                task.priority,
                settings.priorityThreshold
            ) &&
            // Check to make sure all tags in the settings appear in the task's tags
            settings.tags.filter((tag) => !task.tags.includes(tag)).length === 0
    );
};

// Sorts the tasks based on the parameter and order
const sortTasks = (tasks: Task[], parameter: SortParameter, order: SortOrder): Task[] => {
    // Make a copy to avoid mutating the original
    const copyTasks = [...tasks];

    if (parameter === SortParameter.Name) {
        copyTasks.sort((task1, task2) => task1.name.localeCompare(task2.name));
    } else if (parameter === SortParameter.Priority) {
        copyTasks.sort((task1, task2) => task1.priority - task2.priority);
    }

    // Reverse the sort order as needed
    if (parameter !== SortParameter.None && order === SortOrder.Descending) {
        copyTasks.reverse();
    }

    return copyTasks;
};

/**
 * Returns all of the tasks currently visible based on the task list type, factoring in necessary sorting and filtering
 */
export const selectTasksInCurrentTaskList = createSelector(
    [
        selectTaskListType,
        selectAllTasks,
        selectActiveTaskGroupID,
        selectTaskSortOrder,
        selectTaskSortParam,
        selectFilterSettings
    ],
    (
        taskListType,
        tasks,
        activeTaskGroupID,
        taskSortOrder,
        taskSortParam,
        filterSettings
    ) => {
        return sortTasks(
            filterTasksWithSettings(
                tasksInCurrentTaskList(taskListType, tasks, activeTaskGroupID),
                filterSettings
            ),
            taskSortParam,
            taskSortOrder
        );
    }
);

/**
 * Returns the task with the given ID if it exists, throwing an error otherwise
 * @param id ID to search for
 */
export const getTaskByID =
    (id: string) =>
    (state: TodoState): Task => {
        const task = state.tasks.find((task) => task.id === id);

        if (task === undefined) {
            throw new Error(`Task with ID ${id} not found!`);
        } else {
            return task;
        }
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

/**
 * Selects the alphabetically sorted list of all tags
 */
export const selectAllTags = createSelector([selectAllTasks], (tasks) => {
    const all = new Set<string>();

    tasks.forEach((task) => {
        task.tags.forEach((tag) => all.add(tag));
    });

    const values = Array.from(all);

    values.sort();

    return values;
});

// #endregion

// #region notifications
/**
 * Selects all of the notifications
 */
export const selectNotifications = (state: TodoState): AppNotification[] =>
    state.notifications;

// #endregion

/**
 * Selects the current page
 */
export const selectCurrentPage = (state: TodoState): AppPage => state.currentPage;

/**
 * Selects the active modal
 */
export const selectActiveModal = (state: TodoState): Modal => state.activeModal;

/**
 * Returns a JSON string representing the save data, for use with exporting
 */
export const selectSaveData = createSelector(
    [selectTaskGroups, selectAllTasks],
    (taskGroups, tasks) =>
        JSON.stringify({
            taskGroups,
            tasks: tasks.map((task) => formatTaskForStorage(task))
        })
);
