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
