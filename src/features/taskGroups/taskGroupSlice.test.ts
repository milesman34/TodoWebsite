import { TaskGroup } from "./TaskGroup";
import reducer, { addTaskGroup, initialState } from "./taskGroupSlice";

import { describe, expect, test } from "vitest";

describe("taskGroupSlice", () => {
    describe("addTaskGroup", () => {
        test("addTaskGroup adds a task group", () => {
            const state = initialState;

            const taskGroup = TaskGroup("Test", "", "0");

            const newState = reducer(state, addTaskGroup(taskGroup));

            expect(newState.groups).toEqual([taskGroup]);
            expect(newState.activeTaskGroup).toBe("0");
        });

        test("addTaskGroup adds multiple task groups", () => {
            const state = initialState;

            const taskGroup1 = TaskGroup("Test", "", "0");
            const taskGroup2 = TaskGroup("Test2", "Description", "1");

            const newState1 = reducer(state, addTaskGroup(taskGroup1));
            const newState2 = reducer(newState1, addTaskGroup(taskGroup2));

            expect(newState2.groups).toEqual([taskGroup1, taskGroup2]);
            expect(newState2.activeTaskGroup).toBe("1");
        });
    });
});
