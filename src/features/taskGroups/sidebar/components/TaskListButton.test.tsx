import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../../../redux/store";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { TaskListButton } from "./TaskListButton";
import { switchToAllTasks, TaskListType } from "../../../../redux/todoSlice";
import { clickButton, containsClass, getTextContent } from "../../../../utils/testUtils";

describe("TaskListButton", () => {
    describe("TaskListButton displays correct text", () => {
        test("TaskListButton displays correct text", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <TaskListButton
                        id="id1"
                        taskType={TaskListType.All}
                        onClick={() => {}}
                        text={"All Tasks"}
                    />
                </Provider>
            );

            expect(getTextContent("id1")).toBe("All Tasks");
        });

        test("TaskListButton has the active class if active", () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TaskListButton
                        id="id1"
                        taskType={TaskListType.All}
                        onClick={() => {}}
                        text={"All Tasks"}
                    />
                </Provider>
            );

            expect(containsClass("id1", "tasks-button-active")).toBeTruthy();
        });

        test("TaskListButton does not have the active class if not active", () => {
            const store = createStore();

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <TaskListButton
                        id="id1"
                        taskType={TaskListType.Ungrouped}
                        onClick={() => {}}
                        text={"All Tasks"}
                    />
                </Provider>
            );

            expect(containsClass("id1", "tasks-button-active")).toBeFalsy();
        });

        test("TaskListButton runs a function when clicked", async () => {
            const store = createStore();

            const mockFn = vi.fn();

            render(
                <Provider store={store}>
                    <TaskListButton
                        id="id1"
                        taskType={TaskListType.Ungrouped}
                        onClick={mockFn}
                        text={"All Tasks"}
                    />
                </Provider>
            );

            await clickButton("id1");

            expect(mockFn).toHaveBeenCalledOnce();
        });
    });
});
