import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../../redux/store";
import {
    addTask,
    addTaskGroup,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../../../redux/todoSlice";
import {
    clickButton,
    countElementChildren,
    getTextContent,
    mockConfirm,
    mockLocalStorage,
    mockPrompt
} from "../../../utils/testUtils";
import { TaskGroup } from "../../taskGroups/TaskGroup";
import { Task } from "../Task";
import { TaskComponent } from "./TaskComponent";

describe("TaskComponent", () => {
    describe("TaskComponent displays the correct information", () => {
        test("TaskComponent displays the title", () => {
            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            expect(getTextContent("task-component-name-text-id1")).toBe("My task");
        });
    });

    describe("Clicking on a closed TaskComponent opens it", () => {
        test("Clicking on the name display of a closed TaskComponent opens it", async () => {
            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-name-text-id1");

            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();
        });

        test("Clicking on the footer of a closed TaskComponent opens it", async () => {
            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-footer-id1");

            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();
        });
    });

    describe("Clicking on the top of an open TaskComponent closes it", () => {
        test("Clicking on the top of an open TaskComponent closes it", async () => {
            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-name-text-id1");

            await clickButton("task-component-name-text-id1");

            expect(screen.queryByTestId("task-body-id1")).toBeFalsy();
        });
    });

    describe("Clicking the Edit Name button lets you edit the task's name", () => {
        test("Clicking the Edit Name button lets you change the name", async () => {
            vi.stubGlobal("prompt", () => "First Task");

            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-name-text-id1");

            await clickButton("edit-name-task-button-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("First Task");
        });

        test("Clicking the Edit Name button and cancelling out does not change the name", async () => {
            vi.stubGlobal("prompt", () => undefined);

            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-name-text-id1");

            await clickButton("edit-name-task-button-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My task");
        });

        test("Clicking the Edit Name button and submitting an empty name does not change the name", async () => {
            vi.stubGlobal("prompt", () => "");

            const task = Task({ name: "My task", id: "id1" });

            const store = createStore();

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <TaskComponent taskID={task.id} />
                </Provider>
            );

            await clickButton("task-component-name-text-id1");

            await clickButton("edit-name-task-button-id1");

            expect(getTextContent("task-component-name-text-id1")).toBe("My task");
        });
    });

    describe("Task description displays the current description", () => {
        test("Displays the current description", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        description: "My description",
                        id: "id1"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Open the task
            await clickButton("task-component-name-text-id1");

            // Check if the description matches
            expect(getTextContent("task-description-textarea-id1")).toBe(
                "My description"
            );
        });
    });

    describe("Task priority label displays the current priority", () => {
        test("Task priority label displays the current priority", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Check if the priority label matches
            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 5");
        });
    });

    describe("Set priority button lets the user set the priority", () => {
        test("Set priority button when 0 is entered", async () => {
            vi.stubGlobal("prompt", () => "0");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 1,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 0");
        });

        test("Set priority button when positive integer is entered", async () => {
            vi.stubGlobal("prompt", () => "10");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 10");
        });

        test("Set priority button when negative integer is entered", async () => {
            vi.stubGlobal("prompt", () => "-5");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: -5");
        });

        test("Set priority button when prompt is cancelled", async () => {
            vi.stubGlobal("prompt", () => undefined);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 0");
        });

        test("Set priority button when prompt is empty", async () => {
            vi.stubGlobal("prompt", () => "");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 0");
        });

        test("Set priority button when prompt is a decimal number", async () => {
            vi.stubGlobal("prompt", () => "3.5");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 3.5");
        });

        test("Set priority button when prompt is not a number", async () => {
            vi.stubGlobal("prompt", () => "string");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            // Click the set priority button
            await clickButton("task-priority-set-button-id1");

            // Check if the priority is updated
            expect(getTextContent("task-priority-label-id1")).toEqual("Priority: 0");
        });
    });

    describe("Buttons for adding/subtracting the priority", () => {
        test("Ability to subtract 10", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1--10");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: -5");
        });

        test("Ability to subtract 5", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1--5");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 0");
        });

        test("Ability to subtract 1", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1--1");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 4");
        });

        test("Ability to add 1", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1-1");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 6");
        });

        test("Ability to add 5", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1-5");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 10");
        });

        test("Ability to add 10", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1-10");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 15");
        });
    });

    describe("Task is saved when it is changed", () => {
        test("Task is saved when it is changed", async () => {
            const mockSetItem = mockLocalStorage({});

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 0,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-add-button-id1-1");

            expect(mockSetItem).toHaveBeenCalledWith(
                "tasks-id1",
                JSON.stringify({
                    name: "My task",
                    description: "",
                    id: "id1",
                    taskGroupID: "",
                    priority: 0,
                    tags: []
                })
            );
        });
    });

    describe("Reset priority button", () => {
        test("Reset priority button resets task priority to 0", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-priority-reset-button-id1");

            expect(getTextContent("task-priority-label-id1")).toBe("Priority: 0");
        });
    });

    describe("Top right displays priority", () => {
        test("Top right corner displays priority", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        priority: 5,
                        isOpen: true
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(getTextContent("task-component-priority-top-right-id1")).toBe("5");
        });
    });

    describe("Task container displays list of tags", () => {
        test("Task container with no tags", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: []
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(countElementChildren("task-tags-list-id1")).toBe(0);
        });

        test("Task container with many tags", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["A", "B", "C"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            const children = screen.getByTestId("task-tags-list-id1").children;

            expect(children.length).toBe(3);

            expect(children[0].textContent).toBe("A");
            expect(children[1].textContent).toBe("B");
            expect(children[2].textContent).toBe("C");
        });
    });

    describe("Ability to add tags", () => {
        test("Add tag to task", async () => {
            mockPrompt("Tag");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: []
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-add-tag-button-id1");

            const children = screen.getByTestId("task-tags-list-id1").children;

            expect(children.length).toBe(1);

            expect(children[0].textContent).toBe("Tag");
        });

        test("Fail to add tag to task because of an empty tag", async () => {
            mockPrompt("");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: []
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-add-tag-button-id1");

            expect(countElementChildren("task-tags-list-id1")).toBe(0);
        });

        test("Fail to add tag to task because of an undefined tag", async () => {
            mockPrompt(null);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: []
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-add-tag-button-id1");

            expect(countElementChildren("task-tags-list-id1")).toBe(0);
        });

        test("Fail to add tag to task because it already existed", async () => {
            mockPrompt("Tag2");

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-add-tag-button-id1");

            const children = screen.getByTestId("task-tags-list-id1").children;

            expect(children.length).toBe(2);

            expect(children[0].textContent).toBe("Tag1");
            expect(children[1].textContent).toBe("Tag2");
        });
    });

    describe("Ability to remove tags", () => {
        test("Remove a tag by clicking on it", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-tag-button-id1-Tag1");

            const children = screen.getByTestId("task-tags-list-id1").children;

            expect(children.length).toBe(1);

            expect(children[0].textContent).toBe("Tag2");
        });
    });

    describe("Ability to reset tags", () => {
        test("Reset the tags if the user confirms", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-reset-tags-button-id1");

            expect(countElementChildren("task-tags-list-id1")).toBe(0);
        });

        test("Don't reset the tags if the user does not confirm", async () => {
            mockConfirm(false);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            await clickButton("task-reset-tags-button-id1");

            expect(countElementChildren("task-tags-list-id1")).toBe(2);
        });
    });

    describe("TaskComponent displays the task's group if the mode is All Tasks", () => {
        test("TaskComponent does not display the task's group in Ungrouped Tasks", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            store.dispatch(switchToUngroupedTasks());

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(screen.queryByTestId("task-component-group-name-id1")).toBeFalsy();
        });

        test("TaskComponent does not display the task's group in when viewing a task group", () => {
            const store = createStore();

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        name: "Group",
                        id: "groupid1"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        taskGroupID: "groupid1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(screen.queryByTestId("task-component-group-name-id1")).toBeFalsy();
        });

        test("TaskComponent displays the task's group when in All Tasks", () => {
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
                        name: "My task",
                        id: "id1",
                        taskGroupID: "groupid1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(getTextContent("task-component-group-name-id1")).toBe("My Group");
        });

        test("TaskComponent displays that an ungrouped task does not have a group when in All Tasks", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag1", "Tag2"]
                    })
                )
            );

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TaskComponent taskID="id1" />
                </Provider>
            );

            expect(getTextContent("task-component-group-name-id1")).toBe("Ungrouped");
        });
    });
});
