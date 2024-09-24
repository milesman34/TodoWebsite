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
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid1" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid2" })
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
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid1" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid2" })
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
                Task({ name: "Task 1", id: "id1", taskGroupID: "groupid1" }),
                Task({ name: "Task 2", id: "id2", taskGroupID: "groupid2" }),
                Task({ name: "Task 3", id: "id3", taskGroupID: "" }),
                Task({ name: "Task 4", id: "id4", taskGroupID: "groupid1" })
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

    describe("Only displays Edit Name button if in a task group", () => {
        test("Displays Edit Name button in a task group", () => {
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

            expect(screen.queryByTestId("group-edit-name-button")).toBeTruthy();
        });

        test("Does not display Edit Name button when not in a task group", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-edit-name-button")).toBeFalsy();
        });
    });

    describe("Can edit the group name using the Edit Name button", () => {
        test("Edit Name button edits the group name", async () => {
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

            await userEvent.click(screen.getByTestId("group-edit-name-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("New Tasks");
        });

        test("Edit Name button does not edit the group name if empty", async () => {
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

            await userEvent.click(screen.getByTestId("group-edit-name-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("My Tasks");
        });

        test("Edit Name button does not edit the group name when quit out", async () => {
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

            await userEvent.click(screen.getByTestId("group-edit-name-button"));

            expect(screen.getByTestId("tasks-type-text").textContent).toBe("My Tasks");
        });
    });

    describe("Group description displays based on if it is in a task or not", () => {
        test("Displays group description in a task group", () => {
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

            expect(screen.queryByTestId("group-description-container")).toBeTruthy();
        });

        test("Does not display group description when not in a task group", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-description-container")).toBeFalsy();
        });
    });

    describe("Group description displays the current description", () => {
        test("Displays the current description", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup({
                    name: "My Tasks",
                    description: "Description",
                    id: "id1"
                })
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            // Check if the description matches
            expect(screen.getByTestId("group-description-textarea").textContent).toBe(
                "Description"
            );
        });
    });
});
