import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../../../redux/store";
import { addTask } from "../../../../../redux/todoSlice";
import { getTextContent } from "../../../../../utils/testUtils";
import { Task } from "../../../Task";
import { TaskTagComponent } from "./TaskTagComponent";

describe("TaskTagComponent", () => {
    describe("TaskTagComponent displays the name of the tag", () => {
        test("Displays the name of the tag", () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskTagComponent taskID="id1" tag="Tag" />
                </Provider>
            );

            expect(getTextContent("task-tag-button-id1-Tag")).toBe("Tag");
        });
    });

    describe("Hovering over the component changes its text", () => {
        test("Hovering over the component changes its text to Delete", async () => {
            const store = createStore();

            store.dispatch(
                addTask(
                    Task({
                        name: "My task",
                        id: "id1",
                        isOpen: true,
                        tags: ["Tag"]
                    })
                )
            );

            render(
                <Provider store={store}>
                    <TaskTagComponent taskID="id1" tag="Tag" />
                </Provider>
            );

            await userEvent.hover(screen.getByTestId("task-tag-button-id1-Tag"));

            expect(getTextContent("task-tag-button-id1-Tag")).toBe("Delete");

            await userEvent.unhover(screen.getByTestId("task-tag-button-id1-Tag"));

            expect(getTextContent("task-tag-button-id1-Tag")).toBe("Tag");
        });
    });
});
