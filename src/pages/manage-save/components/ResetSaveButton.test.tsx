import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { TaskGroup } from "../../../features/taskGroups/TaskGroup";
import { Task } from "../../../features/tasks/Task";
import { createStore } from "../../../redux/store";
import {
    addTask,
    addTaskGroup,
    AppPage,
    setCurrentPage,
    TaskListType
} from "../../../redux/todoSlice";
import {
    clickButton,
    mockConfirm,
    mockLocalStorage,
    mockLocalStorageFull,
    mockSessionStorage
} from "../../../utils/testUtils";
import { ResetSaveButton } from "./ResetSaveButton";

describe("ResetSaveButton", () => {
    describe("Reset save button resets the save", () => {
        test("Confirm is false", async () => {
            const setItem = mockLocalStorage({});

            mockConfirm(false);

            const store = createStore();

            render(
                <Provider store={store}>
                    <ResetSaveButton />
                </Provider>
            );

            await clickButton("reset-save-button");

            expect(setItem).not.toHaveBeenCalled();
        });

        test("Confirm is true, reset save in localStorage + sessionStorage", async () => {
            const { setItem: localSetItem, removeItem: localRemoveItem } =
                mockLocalStorageFull({});

            const sessionSetItem = mockSessionStorage({});

            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        id: "id1",
                        name: "My task"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        id: "id2",
                        name: "New task"
                    })
                )
            );

            render(
                <Provider store={store}>
                    <ResetSaveButton />
                </Provider>
            );

            await clickButton("reset-save-button");

            expect(localSetItem).toHaveBeenCalledWith("tasks", "[]");
            expect(localRemoveItem).toHaveBeenCalledWith("tasks-id1");
            expect(localRemoveItem).toHaveBeenCalledWith("tasks-id2");
            expect(localSetItem).toHaveBeenCalledWith("taskGroups", "[]");
            expect(sessionSetItem).toHaveBeenCalledWith("openTasks", "[]");
            expect(sessionSetItem).toHaveBeenCalledWith("activeTaskGroup", "");
            expect(sessionSetItem).toHaveBeenCalledWith("taskListType", "0");
            expect(sessionSetItem).not.toHaveBeenCalledWith("currentPage", "0");
        });

        test("Confirm is true, reset save in store", async () => {
            mockConfirm(true);

            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        id: "id1",
                        name: "My task"
                    })
                )
            );

            store.dispatch(
                addTask(
                    Task({
                        id: "id2",
                        name: "New task"
                    })
                )
            );

            store.dispatch(
                addTaskGroup(
                    TaskGroup({
                        id: "id3",
                        name: "My group"
                    })
                )
            );

            store.dispatch(setCurrentPage(AppPage.ManageSave));

            render(
                <Provider store={store}>
                    <ResetSaveButton />
                </Provider>
            );

            await clickButton("reset-save-button");

            const state = store.getState();

            expect(state.activeTaskGroup).toBe("");
            expect(state.currentPage).toEqual(AppPage.ManageSave);
            expect(state.taskGroups).toEqual([]);
            expect(state.taskListType).toEqual(TaskListType.All);
            expect(state.tasks).toEqual([]);
        });
    });
});
