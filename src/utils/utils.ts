import { TaskListType } from "../redux/todoSlice";

/**
 * Maps over an array, changing values according to a mapFn if they match a filterFn
 * @param array
 * @param filterFn
 * @param mapFn
 * @returns
 */
export const filterMap = <T>(
    array: T[],
    filterFn: (value: T) => boolean,
    mapFn: (value: T) => T
): T[] => array.map((value) => (filterFn(value) ? mapFn(value) : value));

/**
 * Clamps a number between 2 other numbers
 * @param num
 * @param low
 * @param high
 * @returns
 */
export const clamp = (num: number, low: number, high: number): number =>
    Math.min(high, Math.max(num, low));

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
