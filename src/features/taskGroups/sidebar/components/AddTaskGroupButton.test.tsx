import { describe, expect, test } from "vitest";
import { clickButton, mockNanoid, mockPrompt } from "../../../../utils/testUtils";
import { createStore } from "../../../../redux/store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { AddTaskGroupButton } from "./AddTaskGroupButton";
import { TaskGroup } from "../../TaskGroup";
import { nanoid } from "nanoid";

describe("AddTaskGroupButton", () => {
    describe("Click the add task group button to add a new task", () => {
        test("Click the add task group button with a prompt to add this task group", async () => {
            mockPrompt("My Group");
            mockNanoid(nanoid, "id1");

            const store = createStore();

            render(
                <Provider store={store}>
                    <AddTaskGroupButton />
                </Provider>
            );

            await clickButton("add-task-group-button");

            expect(store.getState().groups).toEqual([
                TaskGroup({
                    name: "My Group",
                    id: "id1"
                })
            ]);
        });

        test("Click the add task group button with an empty prompt does not add this task group", async () => {
            mockPrompt("");

            const store = createStore();

            render(
                <Provider store={store}>
                    <AddTaskGroupButton />
                </Provider>
            );

            await clickButton("add-task-group-button");

            expect(store.getState().groups).toEqual([]);
        });

        test("Click the add task group button with a failed prompt does not add this task group", async () => {
            mockPrompt(null);

            const store = createStore();

            render(
                <Provider store={store}>
                    <AddTaskGroupButton />
                </Provider>
            );

            await clickButton("add-task-group-button");

            expect(store.getState().groups).toEqual([]);
        });
    });
});
