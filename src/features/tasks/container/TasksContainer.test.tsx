import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { render, screen } from "@testing-library/react";
import { TasksContainer } from "./TasksContainer";
import { Provider } from "react-redux";
import {
    addTaskGroup,
    setActiveTaskGroup,
    switchToAllTasks,
    switchToUngroupedTasks
} from "../../../redux/todoSlice";

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
});
