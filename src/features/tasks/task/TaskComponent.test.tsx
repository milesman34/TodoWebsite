import { describe, expect, test, vi } from "vitest";
import { Task } from "../Task";
import { render, screen } from "@testing-library/react";
import { createStore } from "../../../redux/store";
import { Provider } from "react-redux";
import { TaskComponent } from "./TaskComponent";
import userEvent from "@testing-library/user-event";
import { addTask } from "../../../redux/todoSlice";

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

            expect(screen.getByTestId("task-component-name-text-id1").textContent).toBe(
                "My task"
            );
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

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

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

            await userEvent.click(screen.getByTestId("task-component-footer-id1"));

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

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

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

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            await userEvent.click(screen.getByTestId("edit-name-task-button-id1"));

            expect(screen.getByTestId("task-component-name-text-id1").textContent).toBe(
                "First Task"
            );
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

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            await userEvent.click(screen.getByTestId("edit-name-task-button-id1"));

            expect(screen.getByTestId("task-component-name-text-id1").textContent).toBe(
                "My task"
            );
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

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            await userEvent.click(screen.getByTestId("edit-name-task-button-id1"));

            expect(screen.getByTestId("task-component-name-text-id1").textContent).toBe(
                "My task"
            );
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
            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            // Check if the description matches
            expect(screen.getByTestId("task-description-textarea-id1").textContent).toBe(
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
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 5"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 0"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 10"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: -5"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 0"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 0"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 3.5"
            );
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
            await userEvent.click(screen.getByTestId("task-priority-set-button-id1"));

            // Check if the priority is updated
            expect(screen.getByTestId("task-priority-label-id1").textContent).toEqual(
                "Priority: 0"
            );
        });
    });
});
