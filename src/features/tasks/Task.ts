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

// Parses an individual task item
const parseTaskItem = (id: string): Task | null => {
    const taskStorageItem = localStorage.getItem(`tasks-${id}`);

    if (taskStorageItem === null) {
        return null;
    }

    try {
        return {
            ...JSON.parse(taskStorageItem),
            isOpen: false
        };
    } catch {
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

    try {
        const parsed: string[] = JSON.parse(storageItem);

        const tasks = [];

        for (const taskID of parsed) {
            const task = parseTaskItem(taskID);

            if (task !== null) {
                tasks.push(task);
            }
        }

        return tasks;
    } catch {
        return [];
    }
};
