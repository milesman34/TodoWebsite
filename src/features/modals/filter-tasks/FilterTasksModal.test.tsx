import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import {
    Modal,
    Operator,
    setActiveModal,
    setFilterDescription,
    setFilterName,
    setFilterPriorityOperator,
    setFilterPriorityThreshold,
    setFilterTags
} from "../../../redux/todoSlice";
import {
    clickButton,
    enterText,
    getInputText,
    getSelectText as getSelectValue,
    mockPrompt
} from "../../../utils/testUtils";
import { TasksContainer } from "../../tasks/container/TasksContainer";
import { ModalManager } from "../ModalManager";
import { FilterTasksModal } from "./FilterTasksModal";

describe("FilterTasksModal", () => {
    describe("UI elements are correct when loading the modal", () => {
        test("Modal name input displays filter name", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterName("task"));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(getInputText("filter-modal-name")).toBe("task");
        });

        test("Modal description input displays filter description", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterDescription("desc"));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(getInputText("filter-modal-description")).toBe("desc");
        });

        test("Modal priority input displays filter priority", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityThreshold(5));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(getInputText("filter-modal-priority")).toBe("5");
        });

        test("Modal operator input displays filter priority operator", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityOperator(Operator.GreaterThan));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(getSelectValue("filter-modal-prio-operator-select")).toBe(">");
        });
    });

    describe("Setting filters", () => {
        test("Update filter for name", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-name", "task");

            expect(store.getState().filterSettings.name).toBe("task");
        });

        test("Update filter for description", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-description", "desc");

            expect(store.getState().filterSettings.description).toBe("desc");
        });

        test("Update filter for priority", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "3");

            expect(store.getState().filterSettings.priorityThreshold).toBe(3);
        });

        test("Update filter for priority w/ negative number", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "-5");

            expect(store.getState().filterSettings.priorityThreshold).toBe(-5);
        });

        test("Update filter for priority with invalid number resets value to 0", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityThreshold(5));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "twetw");

            expect(store.getState().filterSettings.priorityThreshold).toBe(0);
        });

        test("Update filter for priority with invalid number resets the GUI after exiting it", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityThreshold(5));

            render(
                <Provider store={store}>
                    <TasksContainer />
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "twetw");

            await clickButton("exit-modal-button");

            await clickButton("filter-tasks-button");

            expect(getInputText("filter-modal-priority")).toBe("0");
        });

        test("Update filter for priority operator updates the operator", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("filter-modal-prio-operator-select"), {
                target: {
                    value: "<="
                }
            });

            expect(store.getState().filterSettings.priorityOperator).toEqual(
                Operator.LessOrEqual
            );
        });
    });

    describe("Resetting filters", () => {
        test("Reset filters button resets filters", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterName("task"));
            store.dispatch(setFilterDescription("desc"));
            store.dispatch(setFilterPriorityThreshold(10));
            store.dispatch(setFilterPriorityOperator(Operator.Equals));
            store.dispatch(setFilterTags(["A", "B"]));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("reset-filters-button");

            expect(store.getState().filterSettings.name).toBe("");
            expect(store.getState().filterSettings.description).toBe("");
            expect(store.getState().filterSettings.priorityThreshold).toBe(0);
            expect(store.getState().filterSettings.priorityOperator).toEqual(
                Operator.None
            );
            expect(store.getState().filterSettings.tags).toEqual([]);
        });

        test("Reset filters button resets UI elements", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterName("task"));
            store.dispatch(setFilterDescription("desc"));
            store.dispatch(setFilterPriorityThreshold(10));
            store.dispatch(setFilterPriorityOperator(Operator.Equals));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("reset-filters-button");

            expect(getInputText("filter-modal-name")).toBe("");
            expect(getInputText("filter-modal-description")).toBe("");
            expect(getInputText("filter-modal-priority")).toBe("0");
            expect(getSelectValue("filter-modal-prio-operator-select")).toBe("");
        });
    });

    describe("Update the filter tags", () => {
        test("Component displays tags", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterTags(["A", "B", "C"]));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(3);

            expect(children[0].textContent).toBe("A");
            expect(children[1].textContent).toBe("B");
            expect(children[2].textContent).toBe("C");
        });

        test("Add a new tag", async () => {
            mockPrompt("A");

            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("add-filter-tag-button");

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(1);
            expect(children[0].textContent).toBe("A");

            expect(store.getState().filterSettings.tags).toEqual(["A"]);
        });

        test("Add a new tag with empty string", async () => {
            mockPrompt("");

            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("add-filter-tag-button");

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(0);

            expect(store.getState().filterSettings.tags).toEqual([]);
        });

        test("Add a new tag with null prompt", async () => {
            mockPrompt(null);

            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("add-filter-tag-button");

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(0);

            expect(store.getState().filterSettings.tags).toEqual([]);
        });

        test("Remove a tag", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterTags(["A"]));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("filter-tag-button-A");

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(0);

            expect(store.getState().filterSettings.tags).toEqual([]);
        });

        test("Reset tags", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterTags(["A", "B"]));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("reset-filter-tags-button");

            const children = screen.getByTestId("filter-tags-list").children;

            expect(children.length).toBe(0);

            expect(store.getState().filterSettings.tags).toEqual([]);
        });
    });

    describe("FilterTasksModal is exited when escape is pressed", () => {
        test("Exit modal when escape pressed", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <FilterTasksModal />
                </Provider>
            );

            await userEvent.keyboard("{Escape}");

            expect(store.getState().activeModal).toEqual(Modal.None);
        });
    });

    test("Exit modal when exit modal button pressed", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.FilterTasks));

        render(
            <Provider store={store}>
                <FilterTasksModal />
            </Provider>
        );

        await clickButton("exit-modal-button");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });
});
