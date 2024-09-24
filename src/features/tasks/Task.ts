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
export const Task = (
    name: string,
    description: string,
    id: string,
    taskGroupID: string,
    priority: number,
    tags: string[],
    isOpen = false
): Task => ({
    name,
    description,
    id,
    taskGroupID,
    priority,
    tags,
    isOpen
});
