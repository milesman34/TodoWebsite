import { describe, expect, test } from "vitest";
import { clamp, filterMap } from "./utils";

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

    describe("clamp", () => {
        test("clamp in between", () => {
            expect(clamp(5, 3, 7)).toBe(5);
        });

        test("clamp lower", () => {
            expect(clamp(2, 3, 7)).toBe(3);
        });

        test("clamp higher", () => {
            expect(clamp(8, 3, 7)).toBe(7);
        });
    });
});
