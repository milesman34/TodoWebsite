import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { clickButton } from "../../../utils/testUtils";
import { ImportSaveModal } from "./ImportSaveModal";

describe("ImportSaveModal", () => {
    test("Exit out of modal when escape pressed", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ImportSave));

        render(
            <Provider store={store}>
                <ImportSaveModal />
            </Provider>
        );

        await userEvent.keyboard("{Escape}");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });

    test("Exit modal when exit modal button pressed", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ImportSave));

        render(
            <Provider store={store}>
                <ImportSaveModal />
            </Provider>
        );

        await clickButton("exit-modal-button");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });
});
