import { parseTaskGroupsLocalStorage } from "../features/taskGroups/TaskGroup";
import { parseTasksLocalStorage } from "../features/tasks/Task";
import { createStore } from "../redux/store";
import {
    setActiveTaskGroup,
    setGroups,
    setTaskOpen,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../redux/todoSlice";

/**
 * Gets the TaskListType from session storage
 */
export const loadTaskListTypeSession = (): TaskListType => {
    const item = sessionStorage.getItem("taskListType");

    return item === null || item === "0"
        ? TaskListType.All
        : item === "1"
        ? TaskListType.Ungrouped
        : TaskListType.TaskGroup;
};

/**
 * Gets the list of open tasks by ID
 */
export const loadOpenTaskIDs = (): string[] => {
    const item = sessionStorage.getItem("openTasks");

    if (item === null) {
        return [];
    }

    try {
        return JSON.parse(item);
    } catch {
        return [];
    }
};

/**
 * Sets up a store for the app with important data from localStorage and sessionStorage
 */
export const setupStore = () => {
    const store = createStore();

    // Runs when the app loads, to load from localStorage
    store.dispatch(setGroups(parseTaskGroupsLocalStorage()));
    store.dispatch(setTasks(parseTasksLocalStorage()));

    // Get the task list type from session storage
    const taskListType = loadTaskListTypeSession();

    if (taskListType === TaskListType.All) {
        store.dispatch(switchToAllTasks());
    } else if (taskListType === TaskListType.Ungrouped) {
        store.dispatch(switchToUngroupedTasks());
    } else {
        store.dispatch(
            setActiveTaskGroup(sessionStorage.getItem("activeTaskGroup") || "")
        );
    }

    // Get the list of open tasks by ID
    for (const taskID of loadOpenTaskIDs()) {
        store.dispatch(
            setTaskOpen({
                taskID,
                open: true
            })
        );
    }

    return store;
};
