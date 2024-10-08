import { render, screen } from "@testing-library/react";
import { createStore } from "../../../../redux/store";
import { addTask, addTaskGroup, switchToAllTasks } from "../../../../redux/todoSlice";
import { Task } from "../../Task";
import { Provider } from "react-redux";
import { MoveTaskButton } from "./MoveTaskButton";
import { describe, expect, test } from "vitest";
import { TaskGroup } from "../../../taskGroups/TaskGroup";

describe("MoveTaskButton", () => {
    describe("MoveTaskButton displays the correct options", () => {
        test("MoveTaskButton only has 1 option with no task groups", () => {
            const store = createStore();
            const task = Task({ name: "Task 1", id: "id1" });

            store.dispatch(addTask(task));

            render(
                <Provider store={store}>
                    <MoveTaskButton task={task} />
                </Provider>
            );

            const options = screen.getAllByTestId("move-task-select-option-id1");

            expect(options.length).toBe(1);
            expect(options[0].textContent).toBe("Ungrouped");
        });
        
        test("MoveTaskButton options with several task groups", () => {
            const store = createStore();
            const task = Task({ name: "Task 1", id: "id1" });

            store.dispatch(addTask(task));
            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 1", id: "gid1"})));
            store.dispatch(addTaskGroup(TaskGroup({ name: "Group 2", id: "gid2"})));
            store.dispatch(switchToAllTasks());

            render(
                <Provider store={store}>
                    <MoveTaskButton task={task} />
                </Provider>
            );

            const options = screen.getAllByTestId("move-task-select-option-id1");

            expect(options.length).toBe(3);
            expect(options[0].textContent).toBe("Ungrouped");
            expect(options[1].textContent).toBe("Group 1");
            expect(options[2].textContent).toBe("Group 2");
        });
    });
});
