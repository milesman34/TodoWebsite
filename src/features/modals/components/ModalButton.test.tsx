import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { ModalManager } from "../../../features/modals/ModalManager";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { clickButton, containsClass, getTextContent } from "../../../utils/testUtils";
import { ModalButton } from "./ModalButton";

describe("ModalButton", () => {
    test("ModalButton displays the correct text", () => {
        const store = createStore();

        render(
            <Provider store={store}>
                <ModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                    className="modal"
                />
            </Provider>
        );

        expect(getTextContent("export-save-button")).toBe("Export Save");
    });

    test("ModalButton opens the modal", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.None));

        render(
            <Provider store={store}>
                <ModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                    className="modal"
                />
                <ModalManager />
            </Provider>
        );

        await clickButton("export-save-button");

        expect(screen.queryByTestId("export-save-modal")).toBeTruthy();
    });

    test("ModalButton closes the modal when already active", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ExportSave));

        render(
            <Provider store={store}>
                <ModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                    className="modal"
                />
                <ModalManager />
            </Provider>
        );

        await clickButton("export-save-button");

        expect(screen.queryByTestId("export-save-modal")).toBeFalsy();
    });

    describe("ModalButton classes", () => {
        test("ModalButton does not have modal-button-active when not active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.None));

            render(
                <Provider store={store}>
                    <ModalButton
                        modal={Modal.ExportSave}
                        displayText="Export Save"
                        id="export-save"
                        className="modal"
                    />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeFalsy();
        });

        test("ModalButton has modal-button-active when active", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <ModalButton
                        modal={Modal.ExportSave}
                        displayText="Export Save"
                        id="export-save"
                        className="modal"
                    />
                </Provider>
            );

            expect(
                containsClass("export-save-button", "modal-button-active")
            ).toBeTruthy();
        });
    });
});
