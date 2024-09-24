import { describe, expect, Mock, test, vi } from "vitest";
import { createStore } from "../redux/store";
import { Task } from "../features/tasks/Task";
import {
    addTask,
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

    describe("Editing the name of a task group must update the name of the task group button on the left", () => {
        test("Edit name of task group to update the task group button's name", async () => {
            vi.stubGlobal("prompt", () => "My Tasks");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("New Tasks", "", "groupid1")));
            store.dispatch(addTaskGroup(TaskGroup("Tasks 2", "", "groupid2")));

            store.dispatch(setActiveTaskGroup("groupid1"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the edit title button
            await userEvent.click(screen.getByTestId("group-edit-name-button"));

            // Check the names of the task group buttons
            const children = screen.getByTestId("task-groups-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(3);

            expect(children[1].textContent).toBe("My Tasks");
            expect(children[2].textContent).toBe("Tasks 2");
        });
    });

    describe("Editing the description of a task group preserves this change when the user goes to a different area", () => {
        test("Edit the description of a task group, go to a different page, then go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My tasks", "", "id1")));

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Edit the description
            await userEvent.type(
                screen.getByTestId("group-description-textarea"),
                "My Task Group"
            );

            // Go to a different page
            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Go back to this page
            await userEvent.click(screen.getByTestId("task-group-component-id1"));

            // Check if the description is accurate
            const textarea = screen.getByTestId("group-description-textarea");

            expect(textarea.textContent).toBe("My Task Group");
        });
    });

    describe("Editing the description of a task preserves this change when the user goes to a different area", () => {
        test("Edit the description of a task, go to a different page, then go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My tasks", "", "groupid1")));
            store.dispatch(addTask(Task("My task", "", "id1", "groupid1", 0, [])));

            store.dispatch(setActiveTaskGroup("groupid1"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the task
            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            // Edit the description
            await userEvent.type(
                screen.getByTestId("task-description-textarea-id1"),
                "My Description"
            );

            // Go to a different page
            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Go back to this page
            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Check if the description is accurate
            const textarea = screen.getByTestId("task-description-textarea-id1");

            expect(textarea.textContent).toBe("My Description");
        });
    });

    describe("An open task should stay open if the page is changed", () => {
        test("Open task, go to different task group page, go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup("My tasks", "", "groupid1")));
            store.dispatch(addTaskGroup(TaskGroup("My tasks 2", "", "groupid2")));

            store.dispatch(setActiveTaskGroup("groupid1"));
            store.dispatch(addTask(Task("My task", "", "id1", "groupid1", 0, [])));
            store.dispatch(addTask(Task("My task", "", "id2", "groupid1", 0, [])));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Open the task
            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            // Go to a different page
            await userEvent.click(screen.getByTestId("task-group-component-groupid2"));

            // Go back to this page
            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Check if the task is still open
            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();

            // Make sure the other task is still closed
            expect(screen.queryByTestId("task-body-id2")).toBeFalsy();
        });
    });
});
