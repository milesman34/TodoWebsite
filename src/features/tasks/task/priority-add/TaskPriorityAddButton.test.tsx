import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../../redux/store";
import { TaskPriorityAddButton } from "./TaskPriorityAddButton";
import { addTask } from "../../../../redux/todoSlice";
import { Task } from "../../Task";
import userEvent from "@testing-library/user-event";

describe("TaskPriorityAddButton", () => {
    describe("TaskPriorityAddButton displays correct text", () => {
        test("TaskPriorityAddButton with positive number", () => {
            render(
                <Provider store={createStore()}>
                    <TaskPriorityAddButton taskID="id1" amount={1} />
                </Provider>
            );

            expect(screen.getByTestId("task-priority-add-button-id1-1").textContent).toBe(
                "+1"
            );
        });

        test("TaskPriorityAddButton with negative number", () => {
            render(
                <Provider store={createStore()}>
                    <TaskPriorityAddButton taskID="id1" amount={-1} />
                </Provider>
            );

            expect(
                screen.getByTestId("task-priority-add-button-id1--1").textContent
            ).toBe("-1");
        });
    });

    describe("TaskPriorityAddButton updates priority in store", () => {
        test("TaskPriorityAddButton with positive number", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 5
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskPriorityAddButton taskID="id1" amount={1} />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("task-priority-add-button-id1-1"));

            expect(store.getState().tasks[0].priority).toBe(6);
        });
        
        test("TaskPriorityAddButton with negative number", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "Task 1",
                        id: "id1",
                        priority: 5
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskPriorityAddButton taskID="id1" amount={-1} />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("task-priority-add-button-id1--1"));

            expect(store.getState().tasks[0].priority).toBe(4);
        });
    });
});
