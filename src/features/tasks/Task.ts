/**
 * Represents a given task
 */
export type Task = {
    name: string;
    description: string;

    // ID of the parent task group (empty means no parent)
    taskGroupID: string;

    priority: number;

    // List of tags for tasks
    tags: string[];
};

/**
 * Creates a Task
 * @param name
 * @param description
 * @param taskGroupID
 * @param priority
 * @param tags
 * @returns
 */
export const Task = (
    name: string,
    description: string,
    taskGroupID: string,
    priority: number,
    tags: string[]
): Task => ({
    name,
    description,
    taskGroupID,
    priority,
    tags
});
