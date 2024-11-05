import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { TaskGroup } from "../../features/taskGroups/TaskGroup";
import { Task } from "../../features/tasks/Task";
import { createStore } from "../../redux/store";
import {
    addTask,
    addTaskGroup,
    Modal,
    setActiveModal,
    setActiveTaskGroup,
    setTaskGroups,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../../redux/todoSlice";
import {
    clickButton,
    countElementChildren,
    enterText,
    getTestID,
    getTextContent,
    mockConfirm,
    mockNanoid,
    mockPrompt
} from "../../utils/testUtils";
import { MainPage } from "./MainPage";
import { ModalManager } from "../../features/modals/ModalManager";

describe("MainPage", () => {
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
                    <MainPage />
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
                    <MainPage />
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
            store.dispatch(setTaskGroups(taskGroups));

            render(
                <Provider store={store}>
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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
                    <MainPage />
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

    describe("Delete a task group", () => {
        test("Not confirming the deletion does not delete the task group", async () => {
            mockConfirm(false);

            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            await clickButton("group-delete-button");

            // Confirm the task group still exists by checking the sidebar
            expect(screen.queryByTestId("task-group-component-id1")).toBeTruthy();

            // Confirm the task container still is on this task group
            expect(getTextContent("tasks-type-text")).toBe("My Group");
        });

        test("Confirming the deletion deletes the task group (this one has no tasks)", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My Group",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            await clickButton("group-delete-button");

            // Confirm the task group does not exist by checking the sidebar
            expect(screen.queryByTestId("task-group-component-id1")).toBeFalsy();

            // Confirm the task container is on all tasks
            expect(getTextContent("tasks-type-text")).toBe("All Tasks");
        });

        test("Deleting with preserve tasks checked preserves the tasks", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My Group",
                        id: "groupid1"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        name: "My Task",
                        id: "id1",
                        taskGroupID: "groupid1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            await clickButton("group-delete-button");

            // Confirm this task exists
            expect(screen.queryByTestId("task-component-id1")).toBeTruthy();
        });

        test("Deleting with preserve tasks unchecked deletes the tasks", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My Group",
                        id: "groupid1"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        name: "My Task",
                        id: "id1",
                        taskGroupID: "groupid1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            await clickButton("preserve-tasks-checkbox");
            await clickButton("group-delete-button");

            // Confirm this task exists
            expect(screen.queryByTestId("task-component-id1")).toBeFalsy();
        });
    });

    describe("Ability to move tasks between groups", () => {
        test("Move a task to ungrouped tasks", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "groupid1" })));

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        taskGroupID: "groupid1",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("move-task-select-id1"), {
                target: {
                    value: "Ungrouped"
                }
            });

            expect(getTextContent("tasks-type-text")).toBe("Ungrouped Tasks");

            expect(screen.getByTestId("task-component-id1")).toBeTruthy();
        });

        test("Move a task to ungrouped tasks that was already in ungrouped tasks", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "groupid1" })));

            store.dispatch(switchToUngroupedTasks());

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("move-task-select-id1"), {
                target: {
                    value: "Ungrouped"
                }
            });

            expect(getTextContent("tasks-type-text")).toBe("Ungrouped Tasks");

            expect(getTextContent("tasks-type-text")).toBe("Ungrouped Tasks");
        });

        test("Move a task to ungrouped tasks while in all tasks", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "groupid1" })));

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        taskGroupID: "groupid1",
                        isOpen: true
                    })
                )
            );

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("move-task-select-id1"), {
                target: {
                    value: "Ungrouped"
                }
            });

            expect(getTextContent("tasks-type-text")).toBe("All Tasks");
            expect(getTextContent("task-component-group-name-id1")).toBe("Ungrouped");
        });

        test("Move a task from ungrouped tasks to a group", () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "groupid1" })));

            store.dispatch(switchToAllTasks());

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("move-task-select-id1"), {
                target: {
                    value: "groupid1"
                }
            });

            expect(getTextContent("tasks-type-text")).toBe("Group 1");
            expect(screen.getByTestId("task-component-id1")).toBeTruthy();
        });

        test("Move a task from a group to another group", async () => {
            const store = createStore();

            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "groupid1" })));
            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 2", id: "groupid2" })));

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        taskGroupID: "groupid2",
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <MainPage />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("move-task-select-id1"), {
                target: {
                    value: "groupid1"
                }
            });

            expect(getTextContent("tasks-type-text")).toBe("Group 1");
            expect(screen.queryByTestId("task-component-id1")).toBeTruthy();

            await clickButton("task-group-component-groupid2");
            expect(screen.queryByTestId("task-component-id1")).toBeFalsy();
        });
    });

    describe("Turn off filter tasks modal when going between task lists", () => {
        test("It stays on when staying on all tasks", async () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("all-tasks-button");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeTruthy();
        });

        test("It stays on when staying on ungrouped tasks", async () => {
            const store = createStore();

            store.dispatch(switchToUngroupedTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("ungrouped-tasks-button");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeTruthy();
        });

        test("It turns off when switching to all tasks", async () => {
            const store = createStore();

            store.dispatch(switchToUngroupedTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("all-tasks-button");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeFalsy();
        });

        test("It turns off when switching to ungrouped tasks", async () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("ungrouped-tasks-button");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeFalsy();
        });

        test("It turns off when switching to a task group", async () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My group",
                        id: "id1"
                    })
                )
            );

            store.dispatch(switchToAllTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("task-group-component-id1");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeFalsy();
        });

        test("It turns off when switching out of a task group", async () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());
            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "My group",
                        id: "id1"
                    })
                )
            );

            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <MainPage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("task-group-component-id1");

            expect(screen.queryByTestId("filter-tasks-modal")).toBeFalsy();
        });
    });
});
