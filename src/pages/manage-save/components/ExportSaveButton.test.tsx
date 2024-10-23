import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { ModalManager } from "../../../features/modals/ModalManager";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { clickButton } from "../../../utils/testUtils";
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
});
