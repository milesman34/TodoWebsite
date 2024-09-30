import { describe, expect, test, vi } from "vitest";
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
import {
    clickButton,
    countElementChildren,
    enterText,
    getTestID,
    getTextContent,
    mockNanoid,
    mockPrompt
} from "../utils/testUtils";

vi.mock("nanoid", () => ({
    nanoid: vi.fn()
}));

describe("Root", () => {
    describe("Clicking the All Tasks button must display all the tasks", () => {
        test("Clicking the All Tasks button displays all the tasks", async () => {
            const store = createStore();

            const tasks = [
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid2" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid1" })
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setActiveTaskGroup("random"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the all tasks button
            await clickButton("all-tasks-button");

            // Make sure all the tasks display
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(4);

            for (let i = 0; i < tasks.length; i++) {
                // Make sure the corresponding element in the collection array matches with the one in the task array
                expect(getTestID(children[i])).toBe(`task-component-${tasks[i].id}`);
            }
        });

        test("Clicking the Ungrouped Tasks button displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid2" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid1" })
            ];

            store.dispatch(setTasks(tasks));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the ungrouped tasks button
            await clickButton("ungrouped-tasks-button");

            // Make sure all the tasks display
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id3");
        });

        test("Clicking on a Task Group displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid2" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid1" })
            ];

            const taskGroups = [
                TaskGroup({ name: "Group 1", id: "groupid1" }),
                TaskGroup({ name: "Group 2", id: "groupid2" })
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(taskGroups));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the task group button
            await clickButton("task-group-component-groupid1");

            // Make sure all the tasks display
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(2);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTestID(children[1])).toBe("task-component-id4");
        });
    });

    describe("Creating a new task while in All Tasks creates an ungrouped task", () => {
        test("Create a new task in All Tasks creates the new task", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in All Tasks creates a new ungrouped task", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("ungrouped-tasks-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in All Tasks creates a new task not found in a task group", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));
            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("task-group-component-groupid1");

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });
    });

    describe("Creating a new task while in Ungrouped Tasks creates an ungrouped task", () => {
        test("Create a new task in Ungrouped Tasks creates the new task", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in Ungrouped Tasks creates a new task visible via all tasks", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("all-tasks-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in Ungrouped Tasks creates a new task not found in a task group", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));
            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("task-group-component-groupid1");

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });
    });

    describe("Creating a new task while in a specific task group creates a new task in that task group", () => {
        test("Create a new task in a task group creates the new task", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in a task group creates a new task visible via all tasks", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("all-tasks-button");

            // Make sure the new task was created
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My Task");
        });

        test("Create a new task in a task group creates a new task not found in ungrouped tasks", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));
            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("task-group-component-groupid1");

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });

        test("Create a new task in a task group creates a new task not found in a different task group", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");

            const store = createStore();

            store.dispatch(
                addTaskGroup(TaskGroup({ name: "My Group 2", id: "groupid2" }))
            );

            store.dispatch(addTaskGroup(TaskGroup({ name: "My Group", id: "groupid1" })));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the add task button
            await clickButton("add-task-button");

            await clickButton("task-group-component-groupid2");

            // Make sure the new task does not appear in the task group
            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });
    });

    describe("Editing the name of a task group must update the name of the task group button on the left", () => {
        test("Edit name of task group to update the task group button's name", async () => {
            mockPrompt("My Tasks");

            const store = createStore();

            store.dispatch(
                addTaskGroup(TaskGroup({ name: "New Tasks", id: "groupid1" }))
            );

            store.dispatch(addTaskGroup(TaskGroup({ name: "Tasks 2", id: "groupid2" })));

            store.dispatch(setActiveTaskGroup("groupid1"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the edit title button
            await clickButton("group-edit-name-button");

            // Check the names of the task group buttons
            const children = screen.getByTestId("task-groups-container")?.children;

            expect(children.length).toBe(3);

            expect(children[1].textContent).toBe("My Tasks");
            expect(children[2].textContent).toBe("Tasks 2");
        });
    });

    describe("Editing the description of a task group preserves this change when the user goes to a different area", () => {
        test("Edit the description of a task group, go to a different page, then go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My tasks", id: "id1" })));

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
            await clickButton("all-tasks-button");

            // Go back to this page
            await clickButton("task-group-component-id1");

            // Check if the description is accurate
            expect(getTextContent("group-description-textarea")).toBe("My Task Group");
        });
    });

    describe("Editing the description of a task preserves this change when the user goes to a different area", () => {
        test("Edit the description of a task, go to a different page, then go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My tasks", id: "groupid1" })));

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        taskGroupID: "groupid1"
                    })
                )
            );

            store.dispatch(setActiveTaskGroup("groupid1"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the task
            await clickButton("task-component-name-text-id1");

            // Edit the description
            await enterText("task-description-textarea-id1", "My Description");

            // Go to a different page
            await clickButton("all-tasks-button");

            // Go back to this page
            await clickButton("task-group-component-groupid1");

            // Check if the description is accurate
            expect(getTextContent("task-description-textarea-id1")).toBe(
                "My Description"
            );
        });
    });

    describe("An open task should stay open if the page is changed", () => {
        test("Open task, go to different task group page, go back", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "My tasks", id: "groupid1" })));

            store.dispatch(
                addTaskGroup(TaskGroup({ name: "My tasks 2", id: "groupid2" }))
            );

            store.dispatch(setActiveTaskGroup("groupid1"));

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        taskGroupID: "groupid1"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id2",
                        taskGroupID: "groupid1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Open the task
            await clickButton("task-component-name-text-id1");

            // Go to a different page
            await clickButton("task-group-component-groupid2");

            // Go back to this page
            await clickButton("task-group-component-groupid1");

            // Check if the task is still open
            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();

            // Make sure the other task is still closed
            expect(screen.queryByTestId("task-body-id2")).toBeFalsy();
        });
    });
});
