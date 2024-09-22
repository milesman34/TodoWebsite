import { describe, expect, Mock, test, vi } from "vitest";
import { createStore } from "../../../redux/store";
import { render, screen } from "@testing-library/react";
import { TasksContainer } from "./TasksContainer";
import { Provider } from "react-redux";
import {
    addTaskGroup,
    setActiveTaskGroup,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../../../redux/todoSlice";
import { Task } from "../Task";
import userEvent from "@testing-library/user-event";
import { nanoid } from "nanoid";

vi.mock("nanoid", () => ({
    nanoid: vi.fn()
}));

describe("TasksContainer", () => {
    describe("TasksContainer displays the correct label for the list of tasks", () => {
        test('TasksContainer displays the label "All Tasks" when set to All Tasks', () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("All Tasks");
        });

        test('TasksContainer displays the label "Ungrouped Tasks" when set to Ungrouped Tasks', () => {
            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.getByTestId("tasks-type-text").textContent).toBe(
                "Ungrouped Tasks"
            );
        });

        test("TasksContainer displays the name of the task group when one is active", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("My Tasks");
        });
    });

    describe("TasksContainer displays the correct list of tasks", () => {
        test("TasksContainer displays all tasks when set to All Tasks", () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid1", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid2", 0, [])
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(4);

            for (let i = 0; i < tasks.length; i++) {
                // Make sure the corresponding element in the collection array matches with the one in the task array
                expect(children[i].attributes.getNamedItem("data-testid")?.value).toBe(
                    `task-component-${tasks[i].id}`
                );
            }
        });

        test("TasksContainer displays ungrouped tasks when set to All Tasks", () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid1", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid2", 0, [])
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id3"
            );
        });

        test("TasksContainer displays tasks in the corresponding group when a group is active", () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setActiveTaskGroup("groupid1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(2);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(children[1].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id4"
            );
        });
    });

    describe("Ability to add new Tasks", () => {
        test("Add Task button creates a new task", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "First Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("add-task-button"));

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "First Task"
            );
        });

        test("Add Task button does not create a new task if the prompt is empty", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("add-task-button"));

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });

        test("Add Task button does not create a new task if the prompt is undefined", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => undefined);

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("add-task-button"));

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });
    });

    describe("Only displays Edit Title button if in a task group", () => {
        test("Displays Edit Title button in a task group", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-edit-title-button")).toBeTruthy();
        });

        test("Does not display Edit Title button when not in a task group", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-edit-title-button")).toBeFalsy();
        });
    });

    describe("Can edit the title using the Edit Title button", () => {
        test("Edit Title button edits the title", async () => {
            vi.stubGlobal("prompt", () => "New Tasks");

            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("group-edit-title-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("New Tasks");
        });

        test("Edit Title button does not edit the title if empty", async () => {
            vi.stubGlobal("prompt", () => "");

            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("group-edit-title-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("My Tasks");
        });

        test("Edit Title button does not edit the title when quit out", async () => {
            vi.stubGlobal("prompt", () => undefined);

            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("group-edit-title-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("My Tasks");
        });
    });
});
