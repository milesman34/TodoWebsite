import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal, setFilterName } from "../../../redux/todoSlice";
import { clickButton, enterText, getInputText } from "../../../utils/testUtils";
import { ModalManager } from "../ModalManager";

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
    });

    describe("Setting filters", () => {
        test("Set filters button sets filters", async () => {
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
    });

    describe("Resetting filters", () => {
        test("Reset filters button resets filters", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterName("task"));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("reset-filters-button");

            expect(store.getState().filterSettings.name).toBe("");
        });

        test("Reset filters button resets UI elements", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.FilterTasks));
            store.dispatch(setFilterName("task"));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("reset-filters-button");

            expect(getInputText("filter-modal-name")).toBe("");
        });
    });
});
