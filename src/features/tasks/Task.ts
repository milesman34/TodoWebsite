/**
 * Represents a given task
 */
export type Task = {
    name: string;
    description: string;

    // ID of the parent task group (empty means no parent)
    taskGroupID: string;

    // Priority of the task (0 is default, higher is higher priority)
    priority: number;

    // List of tags for tasks
    tags: string[];

    id: string;
};

/**
 * Creates a Task
 * @param name
 * @param description
 * @param id
 * @param taskGroupID
 * @param priority
 * @param tags
 * @returns
 */
export const Task = (
    name: string,
    description: string,
    id: string,
    taskGroupID: string,
    priority: number,
    tags: string[]
): Task => ({
    name,
    description,
    id,
    taskGroupID,
    priority,
    tags
});
