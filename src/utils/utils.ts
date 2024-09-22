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
