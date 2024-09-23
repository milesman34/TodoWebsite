import { describe, expect, test } from "vitest";
import { Task } from "../Task";
import { render, screen } from "@testing-library/react";
import { createStore } from "../../../redux/store";
import { Provider } from "react-redux";
import { TaskComponent } from "./TaskComponent";
import userEvent from "@testing-library/user-event";

describe("TaskComponent", () => {
    describe("TaskComponent displays the correct information", () => {
        test("TaskComponent displays the title", () => {
            const task = Task("My task", "", "id1", "", 0, []);

            const store = createStore();

            render(
                <Provider store={store}>
                    <TaskComponent task={task} />
                </Provider>
            );

            expect(screen.getByTestId("task-component-name-text-id1").textContent).toBe(
                "My task"
            );
        });
    });

    describe("Clicking on a closed TaskComponent opens it", () => {
        test("Clicking on the name display of a closed TaskComponent opens it", async () => {
            const task = Task("My task", "", "id1", "", 0, []);

            const store = createStore();

            render(
                <Provider store={store}>
                    <TaskComponent task={task} />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();
        });

        test("Clicking on the footer of a closed TaskComponent opens it", async () => {
            const task = Task("My task", "", "id1", "", 0, []);

            const store = createStore();

            render(
                <Provider store={store}>
                    <TaskComponent task={task} />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("task-component-footer-id1"));

            expect(screen.queryByTestId("task-body-id1")).not.toBeFalsy();
        });
    });

    describe("Clicking on the top of an open TaskComponent closes it", () => {
        test("Clicking on the top of an open TaskComponent closes it", async () => {
            const task = Task("My task", "", "id1", "", 0, []);

            const store = createStore();

            render(
                <Provider store={store}>
                    <TaskComponent task={task} />
                </Provider>
            );

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            await userEvent.click(screen.getByTestId("task-component-name-text-id1"));

            expect(screen.queryByTestId("task-body-id1")).toBeFalsy();
        });
    });
});
