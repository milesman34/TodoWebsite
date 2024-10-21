import omit from "lodash.omit";
import { parseTaskGroupsLocalStorage, TaskGroup } from "../features/taskGroups/TaskGroup";
import { parseTasksLocalStorage, Task } from "../features/tasks/Task";
import { createStore } from "../redux/store";
import {
    AppPage,
    setActiveTaskGroup,
    setCurrentPage,
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
export const loadTaskListType = (): TaskListType => {
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
 * Gets the current page from session storage
 */
export const loadCurrentPage = (): AppPage => {
    const item = sessionStorage.getItem("currentPage");

    return item === null || item === "0" ? AppPage.Main : AppPage.ManageSave;
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
    const taskListType = loadTaskListType();

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

    // Get the current page
    store.dispatch(setCurrentPage(loadCurrentPage()));

    return store;
};

/**
 * Saves the taskGroups to localStorage
 * @param taskGroups
 */
export const saveTaskGroups = (taskGroups: TaskGroup[]) => {
    localStorage.setItem("taskGroups", JSON.stringify(taskGroups));
};

/**
 * Saves the taskListType to sessionStorage
 * @param taskListType
 */
export const saveTaskListType = (taskListType: TaskListType) => {
    sessionStorage.setItem("taskListType", taskListType.toString());
};

/**
 * Saves the active task group to sessionStorage
 * @param activeID
 */
export const saveActiveTaskGroup = (activeID: string) => {
    sessionStorage.setItem("activeTaskGroup", activeID);
};

/**
 * Saves the list of task ids into localStorage
 * @param taskIDs
 */
export const saveTaskIDs = (taskIDs: string[]) => {
    localStorage.setItem("tasks", JSON.stringify(taskIDs));
};

/**
 * Saves the list of open task ids into sessionStorage
 * @param taskIDs
 */
export const saveOpenTaskIDs = (taskIDs: string[]) => {
    sessionStorage.setItem("openTasks", JSON.stringify(taskIDs));
};

/**
 * Saves a task's information into localStorage
 * @param task
 */
export const saveTask = (task: Task) => {
    localStorage.setItem(`tasks-${task.id}`, JSON.stringify(omit(task, "isOpen")));
};

/**
 * Saves the current page to sessionStorage
 */
export const saveCurrentPage = (page: AppPage) => {
    sessionStorage.setItem("currentPage", page.toString());
};
