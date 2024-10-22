import { render } from "@testing-library/react";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
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
});
