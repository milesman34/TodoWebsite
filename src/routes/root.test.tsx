import { describe, expect, test } from "vitest";
import { createStore } from "../redux/store";
import { Task } from "../features/tasks/Task";
import { setActiveTaskGroup, setGroups, setTasks } from "../redux/todoSlice";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { Root } from "./root";
import userEvent from "@testing-library/user-event";
import { TaskGroup } from "../features/taskGroups/TaskGroup";

describe("Root", () => {
    describe("Clicking the All Tasks button must display all the tasks", () => {
        test("Clicking the All Tasks button displays all the tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setActiveTaskGroup("random"));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the all tasks button
            await userEvent.click(screen.getByTestId("all-tasks-button"));

            // Make sure all the tasks display
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

        test("Clicking the Ungrouped Tasks button displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            store.dispatch(setTasks(tasks));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the ungrouped tasks button
            await userEvent.click(screen.getByTestId("ungrouped-tasks-button"));

            // Make sure all the tasks display
            // Get the children of the main container
            const children = screen.getByTestId("task-components-container")?.children;

            expect(children).not.toBeUndefined();
            expect(children.length).toBe(1);

            expect(children[0].attributes.getNamedItem("data-testid")?.value).toBe(
                "task-component-id3"
            );
        });

        test("Clicking on a Task Group displays all the ungrouped tasks", async () => {
            const store = createStore();

            const tasks = [
                Task("Task 1", "", "id1", "groupid1", 0, []),
                Task("Task 2", "", "id2", "groupid2", 0, []),
                Task("Task 3", "", "id3", "", 0, []),
                Task("Task 4", "", "id4", "groupid1", 0, [])
            ];

            const taskGroups = [
                TaskGroup("Group 1", "", "groupid1"),
                TaskGroup("Group 2", "", "groupid2")
            ];

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(taskGroups));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            // Click the task group button
            await userEvent.click(screen.getByTestId("task-group-component-groupid1"));

            // Make sure all the tasks display
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
});
