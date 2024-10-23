import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { ModalManager } from "../../../features/modals/ModalManager";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { clickButton, containsClass } from "../../../utils/testUtils";
import { ExportSaveButton } from "./ExportSaveButton";

describe("ExportSaveButton", () => {
    test("ExportSaveButton opens the modal", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.None));

        render(
            <Provider store={store}>
                <ExportSaveButton />
                <ModalManager />
            </Provider>
        );

        await clickButton("export-save-button");

        expect(screen.queryByTestId("export-save-modal")).toBeTruthy();
    });

    describe("ExportSaveButton classes", () => {
        test("ExportSaveButton does not have modal-button-active when not active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.None));

            render(
                <Provider store={store}>
                    <ExportSaveButton />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeFalsy();
        });

        test("ExportSaveButton has modal-button-active when active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <ExportSaveButton />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeTruthy();
        });
    });
});
