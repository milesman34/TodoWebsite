import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { render, screen } from "@testing-library/react";
import { TasksContainer } from "./TasksContainer";
import { Provider } from "react-redux";
import {
    addTask,
    addTaskGroup,
    setActiveTaskGroup,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../../../redux/todoSlice";
import { Task } from "../Task";
import { nanoid } from "nanoid";
import {
    clickButton,
    countElementChildren,
    getTestID,
    getTextContent,
    mockConfirm,
    mockLocalStorage,
    mockNanoid,
    mockPrompt
} from "../../../utils/testUtils";
import { TaskGroup } from "../../taskGroups/TaskGroup";

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

            expect(getTextContent("tasks-type-text")).toBe("All Tasks");
        });

        test('TasksContainer displays the label "Ungrouped Tasks" when set to Ungrouped Tasks', () => {
            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(getTextContent("tasks-type-text")).toBe("Ungrouped Tasks");
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

            expect(getTextContent("tasks-type-text")).toBe("My Tasks");
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
            const children = screen.getByTestId("task-components-container").children;

            expect(children.length).toBe(4);

            for (let i = 0; i < tasks.length; i++) {
                // Make sure the corresponding element in the collection array matches with the one in the task array
                expect(getTestID(children[i])).toBe(`task-component-${tasks[i].id}`);
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

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id3");
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
            const children = screen.getByTestId("task-components-container").children;

            expect(children.length).toBe(2);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTestID(children[1])).toBe("task-component-id4");
        });
    });

    describe("Ability to add new Tasks", () => {
        test("Add Task button creates a new task", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("First Task");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("add-task-button");

            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("task-component-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("First Task");
        });

        test("Add Task button does not create a new task if the prompt is empty", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("");

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("add-task-button");

            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });

        test("Add Task button does not create a new task if the prompt is undefined", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt(null);

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("add-task-button");

            // Get the children of the main container
            expect(countElementChildren("task-components-container")).toBe(0);
        });

        test("Add Task button updates task list in localStorage", async () => {
            // Set up the mock results
            mockNanoid(nanoid, "id1");
            mockPrompt("My Task");
            const mockSetItem = mockLocalStorage({});

            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("add-task-button");

            expect(mockSetItem).toHaveBeenCalledWith("tasks", JSON.stringify(["id1"]));
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
            mockPrompt("New Tasks");

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

            await clickButton("group-edit-name-button");

            expect(getTextContent("tasks-type-text")).toBe("New Tasks");
        });

        test("Edit Name button does not edit the group name if empty", async () => {
            mockPrompt("");

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

            await clickButton("group-edit-name-button");

            expect(getTextContent("tasks-type-text")).toBe("My Tasks");
        });

        test("Edit Name button does not edit the group name when quit out", async () => {
            mockPrompt(null);

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

            await clickButton("group-edit-name-button");

            expect(getTextContent("tasks-type-text")).toBe("My Tasks");
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
            expect(getTextContent("group-description-textarea")).toBe("Description");
        });
    });

    describe("Delete group button displays only in a Task Group", () => {
        test("Delete group button should not appear if in All Tasks", () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-delete-button")).toBeFalsy();
        });

        test("Delete group button should not appear if in Ungrouped Tasks", () => {
            const store = createStore();

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-delete-button")).toBeFalsy();
        });

        test("Delete group button should appear if in a task group", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Task Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            expect(screen.queryByTestId("group-delete-button")).toBeTruthy();
        });
    });

    describe("Behavior of Preserve Tasks checkbox", () => {
        test("Preserve Tasks checkbox starts as checked", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Task Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            const checkbox = screen.getByTestId(
                "preserve-tasks-checkbox"
            ) as HTMLInputElement;

            expect(checkbox.checked).toBe(true);
        });

        test("Click active checkbox to disable it", async () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Task Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("preserve-tasks-checkbox");

            const checkbox = screen.getByTestId(
                "preserve-tasks-checkbox"
            ) as HTMLInputElement;

            expect(checkbox.checked).toBe(false);
        });

        test("Click active checkbox to disable it", async () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Task Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("preserve-tasks-checkbox");

            const checkbox = screen.getByTestId(
                "preserve-tasks-checkbox"
            ) as HTMLInputElement;

            expect(checkbox.checked).toBe(false);
        });

        test("Click inactive checkbox to enable it", async () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Task Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("preserve-tasks-checkbox");
            await clickButton("preserve-tasks-checkbox");

            const checkbox = screen.getByTestId(
                "preserve-tasks-checkbox"
            ) as HTMLInputElement;

            expect(checkbox.checked).toBe(true);
        });
    });

    describe("Ability to delete tasks", () => {
        test("Delete task button does not delete the task when confirm fails", async () => {
            mockConfirm(false);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("delete-task-button-id1");

            expect(screen.queryByTestId("task-component-id1")).toBeTruthy();
        });

        test("Delete task button deletes the task when confirm succeeds", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TasksContainer />
                </Provider>
            );

            await clickButton("delete-task-button-id1");

            expect(screen.queryByTestId("task-component-id1")).toBeFalsy();
        });
    });
});
