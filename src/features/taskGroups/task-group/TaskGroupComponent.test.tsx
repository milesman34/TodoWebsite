import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { TaskGroupComponent } from "./TaskGroupComponent";
import { TaskGroup } from "../TaskGroup";
import { render } from "@testing-library/react";
import { clickButton, containsClass } from "../../../utils/testUtils";
import { setActiveTaskGroup, setGroups, TaskListType } from "../../../redux/todoSlice";

describe("TaskGroupComponent", () => {
    describe("Component should display if it is active", () => {
        test("Active component has the active class", () => {
            const taskGroup = TaskGroup({
                name: "My Group",
                id: "id1"
            });

            const store = createStore();
            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TaskGroupComponent taskGroup={taskGroup} />
                </Provider>
            );

            // Check if it is active
            expect(
                containsClass("task-group-component-id1", "task-group-component-active")
            ).toBe(true);
        });

        test("Inactive component does not have the active class", () => {
            const taskGroup = TaskGroup({
                name: "My Group",
                id: "id1"
            });

            const store = createStore();
            store.dispatch(setActiveTaskGroup("id2"));

            render(
                <Provider store={store}>
                    <TaskGroupComponent taskGroup={taskGroup} />
                </Provider>
            );

            // Check if it is active
            expect(
                containsClass("task-group-component-id1", "task-group-component-active")
            ).toBe(false);
        });
    });

    describe("User should be able to click on a non-active Task Group to set it as active", () => {
        test("Click on a non-active Task Group to set it as active", async () => {
            const taskGroup = TaskGroup({ name: "My Group", id: "id1" });

            // Set up the store with the task group
            const store = createStore();
            store.dispatch(setGroups([taskGroup]));

            render(
                <Provider store={store}>
                    <TaskGroupComponent taskGroup={taskGroup} />
                </Provider>
            );

            // Click the component
            await clickButton("task-group-component-id1");

            // Check if it is active
            expect(
                containsClass("task-group-component-id1", "task-group-component-active")
            ).toBe(true);
        });
    });

    describe("User must be able to click on an active Task Group to de-activate it and view All Tasks instead", () => {
        test("Click on an active Task Group to set it as in-active", async () => {
            const taskGroup = TaskGroup({ name: "My Group", id: "id1" });

            // Set up the store with the task group
            const store = createStore();
            store.dispatch(setGroups([taskGroup]));
            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TaskGroupComponent taskGroup={taskGroup} />
                </Provider>
            );

            // Click the component
            await clickButton("task-group-component-id1");

            // Check if it is active
            expect(
                containsClass("task-group-component-id1", "task-group-component-active")
            ).toBe(false);
        });

        test("Click on an active Task Group to switch to viewing All Tasks", async () => {
            const taskGroup = TaskGroup({ name: "My Group", id: "id1" });

            // Set up the store with the task group
            const store = createStore();
            store.dispatch(setGroups([taskGroup]));
            store.dispatch(setActiveTaskGroup("id1"));

            render(
                <Provider store={store}>
                    <TaskGroupComponent taskGroup={taskGroup} />
                </Provider>
            );

            // Click the component
            await clickButton("task-group-component-id1");

            // Check if it switched to viewing all tasks
            expect(store.getState().taskListType).toEqual(TaskListType.All);
        });
    });
});
