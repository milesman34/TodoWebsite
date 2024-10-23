import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../redux/store";
import { Modal, setActiveModal } from "../../redux/todoSlice";
import { ModalManager } from "./ModalManager";

describe("ModalManager", () => {
    describe("ModalManager displays the correct modals", () => {
        test("ModalManager does not display modals when set to None", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.None));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(screen.queryByTestId("export-save-modal")).toBeFalsy();
        });

        test("ModalManager displays the export save modal when set to ExportSave", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(screen.queryByTestId("export-save-modal")).toBeTruthy();
        });
    });
});
