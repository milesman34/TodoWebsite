import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../../../redux/store";
import { AppPage, setCurrentPage } from "../../../redux/todoSlice";
import { clickButton, containsClass, getTextContent } from "../../../utils/testUtils";
import { PageButton } from "./PageButton";

describe("PageButton", () => {
    test("PageButton displays the correct text while on a different page", () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.Main));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        expect(getTextContent("page-button-Manage Save")).toBe("Manage Save");
    });

    test("PageButton displays a different text while on the same page", () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.ManageSave));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        expect(getTextContent("page-button-Manage Save")).toBe("Return Home");
    });

    test("Clicking the PageButton while on the main page", async () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.Main));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        await clickButton("page-button-Manage Save");

        expect(store.getState().currentPage).toEqual(AppPage.ManageSave);
    });

    test("Clicking the PageButton while on the manage save page", async () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.ManageSave));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        await clickButton("page-button-Manage Save");

        expect(store.getState().currentPage).toEqual(AppPage.Main);
    });

    test("PageButton has the active class when active", async () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.ManageSave));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        expect(
            containsClass("page-button-Manage Save", "page-button-active")
        ).toBeTruthy();
    });

    test("PageButton does not have the active class when not active", async () => {
        const store = createStore();

        store.dispatch(setCurrentPage(AppPage.Main));

        render(
            <Provider store={store}>
                <PageButton page={AppPage.ManageSave} text="Manage Save" />
            </Provider>
        );

        expect(
            containsClass("page-button-Manage Save", "page-button-active")
        ).toBeFalsy();
    });
});
