import { parseTaskGroupsLocalStorage, TaskGroup } from "../features/taskGroups/TaskGroup";
import {
    formatTaskForStorage,
    parseTasksLocalStorage,
    Task
} from "../features/tasks/Task";
import { createStore } from "../redux/store";
import {
    AppPage,
    setActiveTaskGroup,
    setCurrentPage,
    setTaskGroups,
    setTaskOpen,
    setTasks,
    setTaskSortOrder,
    setTaskSortParam,
    SortOrder,
    SortParameter,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../redux/todoSlice";
import {
    taskGroupSchema,
    taskIDsSchema,
    taskSchema,
    validateWithSchema
} from "./schemas";

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
        const taskIDs = JSON.parse(item);

        return validateWithSchema(taskIDs, taskIDsSchema) ? taskIDs : [];
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
 * Gets the current task sort parameter from session storage
 */
export const loadTaskSortParam = (): SortParameter => {
    const item = sessionStorage.getItem("taskSortParam");

    return item === null || item === "0"
        ? SortParameter.None
        : item === "1"
        ? SortParameter.Name
        : SortParameter.Priority;
};

/**
 * Gets the current task sort order from session storage
 */
export const loadTaskSortOrder = (): SortOrder => {
    const item = sessionStorage.getItem("taskSortOrder");

    return item === null || item === "0" ? SortOrder.Ascending : SortOrder.Descending;
};

/**
 * Sets up a store for the app with important data from localStorage and sessionStorage
 */
export const setupStore = () => {
    const store = createStore();

    // Runs when the app loads, to load from localStorage
    store.dispatch(setTaskGroups(parseTaskGroupsLocalStorage()));
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

    // Gets the task sort info
    store.dispatch(setTaskSortParam(loadTaskSortParam()));
    store.dispatch(setTaskSortOrder(loadTaskSortOrder()));

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
    localStorage.setItem(`tasks-${task.id}`, JSON.stringify(formatTaskForStorage(task)));
};

/**
 * Saves the current page to sessionStorage
 */
export const saveCurrentPage = (page: AppPage) => {
    sessionStorage.setItem("currentPage", page.toString());
};

/**
 * Saves the current task sort parameter to sessionStorage
 */
export const saveTaskSortParam = (param: SortParameter) => {
    sessionStorage.setItem("taskSortParam", param.toString());
};

/**
 * Saves the current task sort order to sessionStorage
 */
export const saveTaskSortOrder = (order: SortOrder) => {
    sessionStorage.setItem("taskSortOrder", order.toString());
};

/**
 * Resets the current save data
 * @param taskIDs list of task ids
 */
export const resetSaveData = (taskIDs: string[]) => {
    localStorage.setItem("taskGroups", "[]");
    localStorage.setItem("tasks", "[]");

    for (const taskID of taskIDs) {
        localStorage.removeItem(`tasks-${taskID}`);
    }

    sessionStorage.setItem("activeTaskGroup", "");
    sessionStorage.setItem("taskListType", "0");
    sessionStorage.setItem("openTasks", "[]");
};

/**
 * Downloads a file with the given name and contents
 */
export const download = (filename: string, contents: string) => {
    const fileInput = document.createElement("a");

    // Set the data + filename
    fileInput.setAttribute("href", `data:text/plain;charset=utf-8,${contents}`);
    fileInput.setAttribute("download", filename);

    fileInput.click();
};

/**
 * Uploads a file from the computer and calls a function with the contents
 */
export const uploadAndCall = async (
    types: string[] = [".json", ".txt"],
    fn: (fileText: string) => Promise<void>
) => {
    // This creates a new file picker so the user can select a file
    const filePicker = document.createElement("input");
    filePicker.type = "file";
    filePicker.accept = types.join(", ");

    filePicker.onchange = () => {
        // Read the chosen file
        filePicker.files![0].arrayBuffer().then(async (arrayBuffer) => {
            const fileText = new TextDecoder().decode(arrayBuffer);

            await fn(fileText);
        });
    };

    filePicker.click();
};

/**
 * Loads the save data from the save text if possible.
 */
export const loadFromSaveText = (
    saveText: string
): {
    tasks: Task[];
    taskGroups: TaskGroup[];
} => {
    try {
        const parsed = JSON.parse(saveText);

        const results: {
            tasks: Task[];
            taskGroups: TaskGroup[];
        } = {
            tasks: [],
            taskGroups: []
        };

        // Check the tasks
        if ("tasks" in parsed) {
            const tasks: Task[] = parsed.tasks;

            if (Array.isArray(tasks)) {
                results.tasks = tasks
                    .filter((task) => validateWithSchema(task, taskSchema))
                    .map((task) => ({
                        ...task,
                        isOpen: false
                    }));
            }
        }

        if ("taskGroups" in parsed) {
            const taskGroups: TaskGroup[] = parsed.taskGroups;

            if (Array.isArray(taskGroups)) {
                results.taskGroups = taskGroups.filter((taskGroup) =>
                    validateWithSchema(taskGroup, taskGroupSchema)
                );
            }
        }

        return results;
    } catch {
        return {
            tasks: [],
            taskGroups: []
        };
    }
};
