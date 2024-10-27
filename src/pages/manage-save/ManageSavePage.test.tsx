import { render, screen } from "@testing-library/react";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { ModalManager } from "../../features/modals/ModalManager";
import { createStore } from "../../redux/store";
import { AppPage, setCurrentPage } from "../../redux/todoSlice";
import { clickButton, mockNanoid, mockSessionStorage } from "../../utils/testUtils";
import { ManageSavePage } from "./ManageSavePage";

describe("ManageSavePage", () => {
    describe("Click on Save Button to save data", () => {
        test("Click on Save Button to save data", async () => {
            mockNanoid(nanoid, "id1");
            const mockSetItem = mockSessionStorage({});

            const store = createStore();

            store.dispatch(setCurrentPage(AppPage.ManageSave));

            render(
                <Provider store={store}>
                    <ManageSavePage />
                </Provider>
            );

            await clickButton("save-button");

            // Just test out saving the current page
            expect(mockSetItem).toHaveBeenCalledWith("currentPage", "1");
        });
    });

    describe("Modal buttons", () => {
        test("ExportSave button opens up ExportSave modal", async () => {
            const store = createStore();

            store.dispatch(setCurrentPage(AppPage.ManageSave));

            render(
                <Provider store={store}>
                    <ManageSavePage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("export-save-button");

            expect(screen.queryByTestId("export-save-modal")).toBeTruthy();
        });

        test("ImportSave button opens up ImportSave modal", async () => {
            const store = createStore();

            store.dispatch(setCurrentPage(AppPage.ManageSave));

            render(
                <Provider store={store}>
                    <ManageSavePage />
                    <ModalManager />
                </Provider>
            );

            await clickButton("import-save-button");

            expect(screen.queryByTestId("import-save-modal")).toBeTruthy();
        });
    });
});
