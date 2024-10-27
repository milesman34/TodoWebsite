import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { SaveModalButton } from "./SaveModalButton";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { clickButton, containsClass, getTextContent } from "../../../utils/testUtils";
import { ModalManager } from "../../../features/modals/ModalManager";

describe("SaveModalButton", () => {
    test("SaveModalButton displays the correct text", () => {
        const store = createStore();

        render(
            <Provider store={store}>
                <SaveModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                />
            </Provider>
        );

        expect(getTextContent("export-save-button")).toBe("Export Save");
    });

    test("SaveModalButton opens the modal", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.None));

        render(
            <Provider store={store}>
                <SaveModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                />
                <ModalManager />
            </Provider>
        );

        await clickButton("export-save-button");

        expect(screen.queryByTestId("export-save-modal")).toBeTruthy();
    });

    test("SaveModalButton closes the modal when already active", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ExportSave));

        render(
            <Provider store={store}>
                <SaveModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                />
                <ModalManager />
            </Provider>
        );

        await clickButton("export-save-button");

        expect(screen.queryByTestId("export-save-modal")).toBeFalsy();
    });

    describe("SaveModalButton classes", () => {
        test("SaveModalButton does not have modal-button-active when not active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.None));

            render(
                <Provider store={store}>
                    <SaveModalButton
                        modal={Modal.ExportSave}
                        displayText="Export Save"
                        id="export-save"
                    />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeFalsy();
        });

        test("SaveModalButton has modal-button-active when active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <SaveModalButton
                        modal={Modal.ExportSave}
                        displayText="Export Save"
                        id="export-save"
                    />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeTruthy();
        });
    });
});
