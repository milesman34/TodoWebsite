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
    setFilterPriorityThreshold
} from "../../../redux/todoSlice";
import {
    clickButton,
    enterText,
    getInputText,
    getSelectText as getSelectValue
} from "../../../utils/testUtils";
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
        test("Set filters button sets filter for name", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-name", "task");

            await clickButton("set-filters-button");

            expect(store.getState().filterSettings.name).toBe("task");
        });

        test("Set filters button sets filter for description", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-description", "desc");

            await clickButton("set-filters-button");

            expect(store.getState().filterSettings.description).toBe("desc");
        });

        test("Set filters button sets filter for priority", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "3");

            await clickButton("set-filters-button");

            expect(store.getState().filterSettings.priorityThreshold).toBe(3);
        });

        test("Set filters button sets filter for priority negative number", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "-5");

            await clickButton("set-filters-button");

            expect(store.getState().filterSettings.priorityThreshold).toBe(-5);
        });

        test("Set filters button resets filter for priority if it is not a number", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityThreshold(5));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "twetw");

            await clickButton("set-filters-button");

            expect(store.getState().filterSettings.priorityThreshold).toBe(0);
        });

        test("Set filters button resets the UI element for priority if it is not a number", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterPriorityThreshold(5));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await enterText("filter-modal-priority", "twetw");

            await clickButton("set-filters-button");

            expect(getInputText("filter-modal-priority")).toBe("0");
        });

        test("Set filters button sets filter priority operator", async () => {
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

            await clickButton("set-filters-button");

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
