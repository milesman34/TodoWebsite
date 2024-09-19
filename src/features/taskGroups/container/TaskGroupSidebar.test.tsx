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
});
