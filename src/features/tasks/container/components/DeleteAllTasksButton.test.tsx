import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../../redux/store";
import {
    setActiveTaskGroup,
    setGroups,
    setTasks,
    switchToAllTasks,
    TaskListType
} from "../../../../redux/todoSlice";
import { clickButton, mockConfirm } from "../../../../utils/testUtils";
import { TaskGroup } from "../../../taskGroups/TaskGroup";
import { Task } from "../../Task";
import { DeleteAllTasksButton } from "./DeleteAllTasksButton";

describe("DeleteAllTasksButton", () => {
    describe("DeleteAllTasks with a task group", () => {
        test("Reject deletion", async () => {
            mockConfirm(false);

            const tasks = [
                Task({ id: "id1", name: "Name" }),
                Task({ id: "id2", name: "My task", taskGroupID: "gid" }),
                Task({ id: "id3", name: "My task 2", taskGroupID: "gid2" }),
                Task({ id: "id4", name: "My task 3", taskGroupID: "gid" })
            ];

            const groups = [
                TaskGroup({ id: "gid", name: "Group 1" }),
                TaskGroup({ id: "gid2", name: "Group 2" })
            ];

            const store = createStore();

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(groups));

            store.dispatch(setActiveTaskGroup("gid"));

            render(
                <Provider store={store}>
                    <DeleteAllTasksButton
                        taskListType={TaskListType.TaskGroup}
                        taskGroupID="gid"
                    />
                </Provider>
            );

            await clickButton("delete-all-tasks-button");

            expect(store.getState().tasks).toEqual(tasks);
        });

        test("Confirm deletion", async () => {
            mockConfirm(true);

            const tasks = [
                Task({ id: "id1", name: "Name" }),
                Task({ id: "id2", name: "My task", taskGroupID: "gid" }),
                Task({ id: "id3", name: "My task 2", taskGroupID: "gid2" }),
                Task({ id: "id4", name: "My task 3", taskGroupID: "gid" })
            ];

            const groups = [
                TaskGroup({ id: "gid", name: "Group 1" }),
                TaskGroup({ id: "gid2", name: "Group 2" })
            ];

            const store = createStore();

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(groups));

            store.dispatch(setActiveTaskGroup("gid"));

            render(
                <Provider store={store}>
                    <DeleteAllTasksButton
                        taskListType={TaskListType.TaskGroup}
                        taskGroupID="gid"
                    />
                </Provider>
            );

            await clickButton("delete-all-tasks-button");

            expect(store.getState().tasks).toEqual([tasks[0], tasks[2]]);
        });
    });

    describe("DeleteAllTasks with all tasks", () => {
        test("Reject deletion", async () => {
            mockConfirm(false);

            const tasks = [
                Task({ id: "id1", name: "Name" }),
                Task({ id: "id2", name: "My task", taskGroupID: "gid" }),
                Task({ id: "id3", name: "My task 2", taskGroupID: "gid2" }),
                Task({ id: "id4", name: "My task 3", taskGroupID: "gid" })
            ];

            const groups = [
                TaskGroup({ id: "gid", name: "Group 1" }),
                TaskGroup({ id: "gid2", name: "Group 2" })
            ];

            const store = createStore();

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(groups));

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <DeleteAllTasksButton
                        taskListType={TaskListType.All}
                        taskGroupID=""
                    />
                </Provider>
            );

            await clickButton("delete-all-tasks-button");

            expect(store.getState().tasks).toEqual(tasks);
        });

        test("Confirm deletion", async () => {
            mockConfirm(true);

            const tasks = [
                Task({ id: "id1", name: "Name" }),
                Task({ id: "id2", name: "My task", taskGroupID: "gid" }),
                Task({ id: "id3", name: "My task 2", taskGroupID: "gid2" }),
                Task({ id: "id4", name: "My task 3", taskGroupID: "gid" })
            ];

            const groups = [
                TaskGroup({ id: "gid", name: "Group 1" }),
                TaskGroup({ id: "gid2", name: "Group 2" })
            ];

            const store = createStore();

            store.dispatch(setTasks(tasks));
            store.dispatch(setGroups(groups));

            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <DeleteAllTasksButton
                        taskListType={TaskListType.All}
                        taskGroupID=""
                    />
                </Provider>
            );

            await clickButton("delete-all-tasks-button");

            expect(store.getState().tasks).toEqual([]);
        });
    });
});
