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
