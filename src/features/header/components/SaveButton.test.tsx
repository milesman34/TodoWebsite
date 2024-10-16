import { describe, expect, test } from "vitest";
import {
    clickButton,
    mockLocalStorage,
    mockNanoid,
    mockSessionStorage
} from "../../../utils/testUtils";
import { createStore } from "../../../redux/store";
import { addTask, addTaskGroup } from "../../../redux/todoSlice";
import { TaskGroup } from "../../taskGroups/TaskGroup";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { SaveButton } from "./SaveButton";
import { Task } from "../../tasks/Task";
import { AppNotification } from "../../notifications/AppNotification";
import { nanoid } from "nanoid";

describe("SaveButton", () => {
    describe("SaveButton when clicked saves the needed information", () => {
        test("SaveButton saves taskGroups", async () => {
            const mockSetItem = mockLocalStorage({});

            const store = createStore();

            const group = TaskGroup({
                name: "Group 1",
                id: "id1"
            });

            store.dispatch(addTaskGroup(group));

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(mockSetItem).toHaveBeenCalledWith(
                "taskGroups",
                JSON.stringify([group])
            );
        });

        test("SaveButton saves task list type", async () => {
            const mockSetItem = mockSessionStorage({});

            const store = createStore();

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(mockSetItem).toHaveBeenCalledWith("taskListType", "0");
        });

        test("SaveButton saves active task group", async () => {
            const mockSetItem = mockSessionStorage({});

            const store = createStore();

            const group = TaskGroup({
                name: "Group 1",
                id: "id1"
            });

            store.dispatch(addTaskGroup(group));

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(mockSetItem).toHaveBeenCalledWith("activeTaskGroup", "id1");
        });

        test("SaveButton saves task list", async () => {
            const mockSetItem = mockLocalStorage({});

            const store = createStore();

            const tasks = [
                Task({
                    name: "My task",
                    id: "id1"
                }),
                Task({
                    name: "Another task",
                    id: "id2"
                })
            ];

            store.dispatch(addTask(tasks[0]));
            store.dispatch(addTask(tasks[1]));

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(mockSetItem).toHaveBeenCalledWith(
                "tasks",
                JSON.stringify(["id1", "id2"])
            );
        });

        test("SaveButton saves open tasks", async () => {
            const mockSetItem = mockSessionStorage({});

            const store = createStore();

            const tasks = [
                Task({
                    name: "My task",
                    id: "id1",
                    isOpen: true
                }),
                Task({
                    name: "Another task",
                    id: "id2"
                })
            ];

            store.dispatch(addTask(tasks[0]));
            store.dispatch(addTask(tasks[1]));

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(mockSetItem).toHaveBeenCalledWith(
                "openTasks",
                JSON.stringify(["id1"])
            );
        });

        test("SaveButton saves task data", async () => {
            const mockSetItem = mockLocalStorage({});

            const store = createStore();

            const task = Task({
                name: "My task",
                id: "id1"
            });

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

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

    describe("SaveButton creates a notification", () => {
        test("SaveButton creates a notification with Saved (testing state)", async () => {
            mockNanoid(nanoid, "id1");

            const store = createStore();

            render(
                <Provider store={store}>
                    <SaveButton />
                </Provider>
            );

            await clickButton("save-button");

            expect(store.getState().notifications).toEqual([AppNotification({
                text: "Saved",
                id: "id1"
            })]);
        });
    });
});
