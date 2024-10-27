import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../../redux/store";
import { Modal, selectSaveData, setActiveModal } from "../../../redux/todoSlice";
import { download } from "../../../utils/storageTools";
import {
    clickButton,
    getTextContent,
    mockClipboardWrite,
    mockNanoid
} from "../../../utils/testUtils";
import { AppNotification } from "../../notifications/AppNotification";
import { ExportSaveModal } from "./ExportSaveModal";

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

    describe("ExportSaveModal export to file", () => {
        const exportToFileMocks = () => {
            // Mock download function from storageTools
            vi.mock("../../../utils/storageTools.ts", (importOriginal) => {
                const mod = importOriginal();

                return {
                    ...mod,

                    // Replace download
                    download: vi.fn()
                };
            });

            // Mock the timestamp
            const dateMock = vi.fn();

            vi.stubGlobal("Date", {
                now: dateMock
            });

            // Set Date to the start of the epoch
            dateMock.mockReturnValue(0);
        };

        test("ExportSaveModal saves the data to a save file", async () => {
            exportToFileMocks();

            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await clickButton("export-save-file-button");

            expect(download).toHaveBeenCalledWith(
                "todo-save-0",
                selectSaveData(store.getState())
            );
        });

        test("Pressing the export to file button exits the modal", async () => {
            exportToFileMocks();

            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await clickButton("export-save-file-button");

            expect(store.getState().activeModal).toEqual(Modal.None);
        });

        test("Pressing the export to file button creates a new notification", async () => {
            exportToFileMocks();

            mockNanoid(nanoid, "id1");

            const store = createStore();

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await clickButton("export-save-file-button");

            expect(store.getState().notifications).toEqual([
                AppNotification({
                    text: "Saved to file",
                    id: "id1"
                })
            ]);
        });
    });

    describe("ExportSaveModal is exited when escape is pressed", () => {
        test("Exit modal when escape pressed", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ExportSave));

            render(
                <Provider store={store}>
                    <ExportSaveModal />
                </Provider>
            );

            await userEvent.keyboard("{Escape}");

            expect(store.getState().activeModal).toEqual(Modal.None);
        });
    });
});
