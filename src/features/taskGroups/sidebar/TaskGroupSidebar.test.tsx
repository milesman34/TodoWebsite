import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskGroupSidebar } from "./TaskGroupSidebar";

import { afterEach, describe, expect, Mock, test, vi } from "vitest";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { createStore } from "../../../app/store";

vi.mock("nanoid", () => ({
    nanoid: vi.fn()
}));

describe("TaskGroupSidebar", () => {
    afterEach(() => {
        cleanup();
    });

    describe("User must be able to press the Add button to create a new Task Group", () => {
        test("Add Task Group button adds a new Task Group (with no task groups added yet)", async () => {
            // Mock return values from nanoid + prompt
            (nanoid as Mock).mockImplementation(() => "id1");

            vi.stubGlobal("prompt", () => "First Task Group");

            // Render the TaskGroupSidebar
            render(
                <Provider store={createStore()}>
                    <TaskGroupSidebar />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("add-task-group-button"));

            // Make sure it has the new task group
            expect(screen.getByTestId("task-group-component-id1")?.textContent).toBe(
                "First Task Group"
            );
        });

        test("Add Task Group button adding multiple task groups", async () => {
            // Render the TaskGroupSidebar
            render(
                <Provider store={createStore()}>
                    <TaskGroupSidebar />
                </Provider>
            );

            for (const pair of [
                { id: "id1", name: "First Task Group" },
                { id: "id2", name: "Second Task Group" }
            ]) {
                (nanoid as Mock).mockImplementation(() => pair.id);

                vi.stubGlobal("prompt", () => pair.name);

                await userEvent.click(screen.getByTestId("add-task-group-button"));
            }

            // Make sure it has the new task groups
            expect(screen.getByTestId("task-group-component-id1")?.textContent).toBe(
                "First Task Group"
            );

            expect(screen.getByTestId("task-group-component-id2")?.textContent).toBe(
                "Second Task Group"
            );
        });

        test("Add Task Group button does not add a new task if the prompt result is empty", async () => {
            const store = createStore();

            // Render the TaskGroupSidebar
            render(
                <Provider store={store}>
                    <TaskGroupSidebar />
                </Provider>
            );

            vi.stubGlobal("prompt", () => "");

            await userEvent.click(screen.getByTestId("add-task-group-button"));

            // There isn't a great way to test for the absence of an element, so instead check the store directly
            expect(store.getState().groups).toEqual([]);
        });

        test("Add Task Group button does not add a new task if the prompt was exited", async () => {
            const store = createStore();

            // Render the TaskGroupSidebar
            render(
                <Provider store={store}>
                    <TaskGroupSidebar />
                </Provider>
            );

            vi.stubGlobal("prompt", () => null);

            await userEvent.click(screen.getByTestId("add-task-group-button"));

            // There isn't a great way to test for the absence of an element, so instead check the store directly
            expect(store.getState().groups).toEqual([]);
        });
    });

    describe("Adding a new Task Group should select it as the active group", () => {
        test("Adding a Task Group should give it the active class", async () => {
            // Mock return values from nanoid + prompt
            (nanoid as Mock).mockImplementation(() => "id1");

            vi.stubGlobal("prompt", () => "First Task Group");

            // Render the TaskGroupSidebar
            render(
                <Provider store={createStore()}>
                    <TaskGroupSidebar />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("add-task-group-button"));

            // Make sure it has the correct class
            expect(
                screen
                    .getByTestId("task-group-component-id1")
                    ?.classList.contains("task-group-component-active")
            ).toBe(true);
        });

        test("Adding multiple Task Groups should only leave the last Task Group with the active class", async () => {
            // Render the TaskGroupSidebar
            render(
                <Provider store={createStore()}>
                    <TaskGroupSidebar />
                </Provider>
            );

            for (const pair of [
                { id: "id1", name: "First Task Group" },
                { id: "id2", name: "Second Task Group" }
            ]) {
                (nanoid as Mock).mockImplementation(() => pair.id);

                vi.stubGlobal("prompt", () => pair.name);

                await userEvent.click(screen.getByTestId("add-task-group-button"));
            }

            // Check that only the second task group has this class
            expect(
                screen
                    .getByTestId("task-group-component-id1")
                    ?.classList.contains("task-group-component-active")
            ).toBe(false);

            expect(
                screen
                    .getByTestId("task-group-component-id2")
                    ?.classList.contains("task-group-component-active")
            ).toBe(true);
        });
    });
});