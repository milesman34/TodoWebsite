import { describe, expect, test } from "vitest";
import { filterMap } from "./utils";

describe("utils", () => {
    describe("filterMap", () => {
        test("filterMap with an array", () => {
            expect(
                filterMap(
                    [1, 2, 3, 4, 5, 6, 7],
                    (e) => e % 2 == 0,
                    (e) => e * 3
                )
            ).toEqual([1, 6, 3, 12, 5, 18, 7]);
        });
    });
});
