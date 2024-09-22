import { describe, expect, Mock, test, vi } from "vitest";
import { createStore } from "../redux/store";
import { Task } from "../features/tasks/Task";
import {
    addTaskGroup,
    setActiveTaskGroup,
    setGroups,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../redux/todoSlice";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { Root } from "./root";
import userEvent from "@testing-library/user-event";
import { TaskGroup } from "../features/taskGroups/TaskGroup";
import { nanoid } from "nanoid";

vi.mock("nanoid", () => ({
    nanoid: vi.fn()
}));

describe("Root", () => {
    describe("Clicking the All Tasks button must display all the tasks", () => {
        test("Clicking the All Tasks button displays all the tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setActiveTaskGroup("random"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the all tasks button
            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Make sure all the tasks display
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

        test("Clicking the Ungrouped Tasks button displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            store.dispatch(setTasks(tasks));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the ungrouped tasks button
            await userEvent.click(screen.getByTestId("ungrouped-tasks-button"));

            // Make sure all the tasks display
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id3"
            );
        });

        test("Clicking on a Task Group displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            const taskGroups = [
                TaskGroup("Group 1", "", "groupid1"),
                TaskGroup("Group 2", "", "groupid2")
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(taskGroups));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the task group button
            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Make sure all the tasks display
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

    describe("Creating a new task while in All Tasks creates an ungrouped task", () => {
        test("Create a new task in All Tasks creates the new task", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in All Tasks creates a new ungrouped task", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("ungrouped-tasks-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in All Tasks creates a new task not found in a task group", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));
            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });
    });

    describe("Creating a new task while in Ungrouped Tasks creates an ungrouped task", () => {
        test("Create a new task in Ungrouped Tasks creates the new task", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in Ungrouped Tasks creates a new task visible via all tasks", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in Ungrouped Tasks creates a new task not found in a task group", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));
            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });
    });

    describe("Creating a new task while in a specific task group creates a new task in that task group", () => {
        test("Create a new task in a task group creates the new task", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in a task group creates a new task visible via all tasks", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id1"
            );

            expect(screen.getByTestId("task-component-name-text-id1")?.textContent).toBe(
                "My Task"
            );
        });

        test("Create a new task in a task group creates a new task not found in ungrouped tasks", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));
            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });

        test("Create a new task in a task group creates a new task not found in a different task group", async () => {
            // Set up the mock results
            (nanoid as Mock).mockImplementation(() => "id1");
            vi.stubGlobal("prompt", () => "My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My Group 2", "", "groupid2")));
            store.dispatch(addTaskGroup(TaskGroup("My Group", "", "groupid1")));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await userEvent.click(screen.getByTestId("add-task-button"));

            await userEvent.click(screen.getByTestId("task-group-component-groupid2"));

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(0);
        });
    });
});
