import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { selectSaveData } from "../../../redux/todoSlice";
import {
    clickButton,
    getTextContent,
    mockClipboardWrite,
    mockNanoid
} from "../../../utils/testUtils";
import { ExportSaveModal } from "./ExportSaveModal";
import { nanoid } from "nanoid";
import { AppNotification } from "../../notifications/AppNotification";

describe("ExportSaveModal", () => {
    describe("ExportSaveModal has the correct save structure", () => {
        test("ExportSaveModal displays the save structure in the textarea", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            // Honestly, there isn't a good way to test it with the hardcoded data, so its easier to just make sure it has the save data
            expect(getTextContent("export-save-textarea")).toBe(
                selectSaveData(store.getState())
            );
        });
    });

    describe("ExportSaveModal copy to clipboard functionality", () => {
        test("ExportSaveModal copies the save data to the clipboard", async () => {
            const write = mockClipboardWrite();

            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await clickButton("export-save-copy-clipboard-button");

            expect(write).toHaveBeenCalledWith(selectSaveData(store.getState()));
        });

        test("ExportSaveModal pushes a notification when copying to the clipboard", async () => {
            mockClipboardWrite();

            mockNanoid(nanoid, "id1");

            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await clickButton("export-save-copy-clipboard-button");

            expect(store.getState().notifications).toEqual([
                AppNotification({
                    text: "Copied to clipboard",
                    id: "id1"
                })
            ]);
        });
    });
});
