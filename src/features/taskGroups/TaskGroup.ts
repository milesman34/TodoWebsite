/**
 * Represents a group of tasks
 */
export type TaskGroup = {
    name: string;
    description: string;

    id: string;
};

/**
 * Creates a TaskGroup
 * @param name
 * @param description
 * @param id
 * @returns
 */
export const TaskGroup = ({
    name,
    description = "",
    id
}: {
    name: string;
    description?: string;
    id: string;
}): TaskGroup => ({
    name,
    description,
    id
});

/**
 * Parses the local storage item to get the list of TaskGroups
 */
export const parseTaskGroupsLocalStorage = (): TaskGroup[] => {
    const storageItem = localStorage.getItem("taskGroups");

    if (storageItem === null) {
        return [];
    }

    try {
        return JSON.parse(storageItem);
    } catch {
        return [];
    }
};
