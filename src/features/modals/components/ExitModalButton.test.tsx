import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { Modal, setActiveModal } from "../../../redux/todoSlice";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ExitModalButton } from "./ExitModalButton";
import { clickButton } from "../../../utils/testUtils";

describe("ExitModalButton", () => {
    test("ExitModalButton exits the current modal when clicked", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ExportSave));

        render(
            <Provider store={store}>
                <ExitModalButton />
            </Provider>
        );

        await clickButton("exit-modal-button");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });
});
