import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { selectSaveData } from "../../../redux/todoSlice";
import { getTextContent } from "../../../utils/testUtils";
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
});
