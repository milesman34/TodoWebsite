import { describe, expect, test } from "vitest";
import { createStore } from "../../../../redux/store";
import { setFilterName } from "../../../../redux/todoSlice";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ResetFiltersButton } from "./ResetFiltersButton";
import { clickButton } from "../../../../utils/testUtils";

describe("ResetFiltersButton", () => {
    test("ResetFiltersButton resets the filter settings", async () => {
        const store = createStore();

        store.dispatch(setFilterName("task"));

        render(
            <Provider store={store}>
                <ResetFiltersButton className="" />
            </Provider>
        );

        await clickButton("reset-filters-button");

        expect(store.getState().filterSettings.name).toBe("");
    });
});
