import typia from "typia";

/**
 * Represents a given task
 */
export type Task = {
    name: string;
    description: string;

    id: string;

    // ID of the parent task group (empty means no parent)
    taskGroupID: string;

    // Priority of the task (0 is default, higher is higher priority)
    priority: number;

    // List of tags for tasks
    tags: string[];

    // Is the task currently open?
    isOpen: boolean;
};

/**
 * Creates a Task
 * @param name
 * @param description
 * @param id
 * @param taskGroupID
 * @param priority
 * @param tags
 * @param isOpen optional
 * @returns
 */
export const Task = ({
    name,
    description = "",
    id,
    taskGroupID = "",
    priority = 0,
    tags = [],
    isOpen = false
}: {
    name: string;
    description?: string;
    id: string;
    taskGroupID?: string;
    priority?: number;
    tags?: string[];
    isOpen?: boolean;
}): Task => ({
    name,
    description,
    id,
    taskGroupID,
    priority,
    tags,
    isOpen
});

// Type for the localStorage saved part of a task
interface ILocalStorageTask {
    name: string;
    description: string;
    id: string;
    taskGroupID: string;
    priority: number;
    tags: string[];
}

// Parses an individual task item
const parseTaskItem = (id: string): Task | null => {
    const taskStorageItem = localStorage.getItem(`tasks-${id}`);

    if (taskStorageItem === null) {
        return null;
    }

    const parsed = JSON.parse(taskStorageItem);

    if (typia.is<ILocalStorageTask>(parsed)) {
        return {
            ...parsed,
            isOpen: false
        };
    } else {
        return null;
    }
};

/**
 * Parses the local storage item to get the list of Tasks
 */
export const parseTasksLocalStorage = (): Task[] => {
    const storageItem = localStorage.getItem("tasks");

    if (storageItem === null) {
        return [];
    }

    const parsed = JSON.parse(storageItem);

    const tasks = [];

    if (typia.is<string[]>(parsed)) {
        for (const taskID of parsed) {
            const task = parseTaskItem(taskID);

            if (task !== null) {
                tasks.push(task);
            }
        }
    }

    return tasks;

    // const parsed = JSON.parse(storageItem);

    // // The isOpen part is only in session storage
    // if (typia.is<ILocalStorageTask[]>(parsed)) {
    //     return parsed.map((task) => ({
    //         ...task,
    //         isOpen: false
    //     }));
    // } else {
    //     return [];
    // }
};
