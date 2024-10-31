import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../../redux/store";
import { setTaskSortOrder, SortOrder, SortParameter } from "../../../../redux/todoSlice";
import { clickButton, getTextContent } from "../../../../utils/testUtils";
import { SortSelectorButton } from "./SortSelectorButton";

describe("SortSelectorButton", () => {
    describe("SortSelectorButton displays correct text", () => {
        test("Ascending", () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Ascending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            expect(getTextContent("sort-select-direction-button")?.trim()).toBe("Asc.");
        });

        test("Descending", () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Descending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            expect(getTextContent("sort-select-direction-button")?.trim()).toBe("Desc.");
        });
    });

    describe("Click direction button to toggle direction", () => {
        test("Switch to descending", async () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Ascending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            await clickButton("sort-select-direction-button");

            expect(store.getState().taskSortOrder).toEqual(SortOrder.Descending);
        });

        test("Switch to ascending", async () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Descending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            await clickButton("sort-select-direction-button");

            expect(store.getState().taskSortOrder).toEqual(SortOrder.Ascending);
        });
    });

    describe("Select sort parameter", () => {
        test("Switch to none", async () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Ascending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("sort-select-button"), {
                target: {
                    value: "None"
                }
            });

            expect(store.getState().taskSortParam).toEqual(SortParameter.None);
        });

        test("Switch to name", async () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Ascending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("sort-select-button"), {
                target: {
                    value: "Name"
                }
            });

            expect(store.getState().taskSortParam).toEqual(SortParameter.Name);
        });

        test("Switch to priority", async () => {
            const store = createStore();

            store.dispatch(setTaskSortOrder(SortOrder.Ascending));

            render(
                <Provider store={store}>
                    <SortSelectorButton />
                </Provider>
            );

            fireEvent.change(screen.getByTestId("sort-select-button"), {
                target: {
                    value: "Priority"
                }
            });

            expect(store.getState().taskSortParam).toEqual(SortParameter.Priority);
        });
    });
});
