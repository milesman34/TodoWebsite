import { render, screen } from "@testing-library/react";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test } from "vitest";
import { createStore } from "../redux/store";
import { AppPage, setCurrentPage } from "../redux/todoSlice";
import { clickButton, getTestID, mockNanoid } from "../utils/testUtils";
import { Root } from "./root";

describe("Root", () => {
    describe("Pressing the save button creates a new notification", () => {
        test("Pressing the save button creates a new notification", async () => {
            mockNanoid(nanoid, "id1");

            const store = createStore();

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            await clickButton("save-button");

            const children = screen.getByTestId("notifications-container").children;

            expect(children.length).toBe(1);

            expect(getTestID(children[0])).toBe("notification-component-id1");
        });
    });

    describe("Root displays the correct pages based on the current page", () => {
        test("Root displays the MainPage if the current page is the main page", () => {
            const store = createStore();

            store.dispatch(setCurrentPage(AppPage.Main));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            expect(screen.queryByTestId("main-page")).toBeTruthy();
        });

        test("Root does not display the MainPage if the current page is not the main page", () => {
            const store = createStore();

            store.dispatch(setCurrentPage(AppPage.ManageSave));

            render(
                <Provider store={store}>
                    <Root />
                </Provider>
            );

            expect(screen.queryByTestId("main-page")).toBeFalsy();
        });
    });
});
