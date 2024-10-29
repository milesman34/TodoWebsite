import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../redux/store";
import { Modal, setActiveModal } from "../../redux/todoSlice";
import { clickButton } from "../../utils/testUtils";
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
            expect(screen.queryByTestId("import-save-modal")).toBeFalsy();
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

        test("ModalManager displays the import save modal when set to ImportSave", () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            expect(screen.queryByTestId("import-save-modal")).toBeTruthy();
        });
    });

    describe("ModalExitButton quits out of the current modal", () => {
        test("ModelExitButton quits out of the current modal", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <ModalManager />
                </Provider>
            );

            await clickButton("exit-modal-button");

            expect(screen.queryByTestId("export-save-model")).toBeFalsy();
        });
    });
});
