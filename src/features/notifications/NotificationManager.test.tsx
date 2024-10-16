import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../redux/store";
import { pushNotification } from "../../redux/todoSlice";
import { clickButton, getTestID } from "../../utils/testUtils";
import { AppNotification } from "./AppNotification";
import { NotificationManager } from "./NotificationManager";

describe("NotificationManager", () => {
    describe("NotificationManager displays notifications", () => {
        test("NotificationManager with empty notifications", () => {
            const store = createStore();

            render(
                <Provider store={store}>
                    <NotificationManager />
                </Provider>
            );

            expect(screen.queryByTestId("notifications-container")).toBeFalsy();
        });

        test("NotificationManager with notifications", () => {
            const store = createStore();

            const ids = ["id1", "id2", "id3", "id4"];

            for (const id of ids) {
                store.dispatch(pushNotification(AppNotification({ text: "", id })));
            }

            render(
                <Provider store={store}>
                    <NotificationManager />
                </Provider>
            );

            const children = screen.getByTestId("notifications-container").children;

            expect(children.length).toBe(4);

            ids.forEach((id, index) => {
                expect(getTestID(children[index])).toBe(`notification-component-${id}`);
            });
        });

        test("NotificationManager with >10 notifications only shows 10", () => {
            const store = createStore();

            const ids = [
                "id1",
                "id2",
                "id3",
                "id4",
                "id5",
                "id6",
                "id7",
                "id8",
                "id9",
                "id10",
                "id11",
                "id12"
            ];

            for (const id of ids) {
                store.dispatch(pushNotification(AppNotification({ text: "", id })));
            }

            render(
                <Provider store={store}>
                    <NotificationManager />
                </Provider>
            );

            const children = screen.getByTestId("notifications-container").children;

            expect(children.length).toBe(10);

            ids.slice(0, 10).forEach((id, index) => {
                expect(getTestID(children[index])).toBe(`notification-component-${id}`);
            });
        });
    });

    describe("Ability to delete notifications", () => {
        test("Click on a notification to delete it", async () => {
            const store = createStore();

            const ids = ["id1", "id2", "id3"];

            for (const id of ids) {
                store.dispatch(pushNotification(AppNotification({ text: "", id })));
            }

            render(
                <Provider store={store}>
                    <NotificationManager />
                </Provider>
            );

            await clickButton("notification-component-id2");

            const children = screen.getByTestId("notifications-container").children;

            expect(children.length).toBe(2);

            expect(getTestID(children[0])).toBe("notification-component-id1");
            expect(getTestID(children[1])).toBe("notification-component-id3");
        });

        test("Waiting long enough deletes the notifications", () => {
            vi.useFakeTimers();

            const store = createStore();

            store.dispatch(pushNotification(AppNotification({ text: "", id: "id1" })));

            render(
                <Provider store={store}>
                    <NotificationManager />
                </Provider>
            );

            act(() => {
                vi.advanceTimersByTime(2500);
            });

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.queryByTestId("notifications-container")).toBeFalsy();
        });
    });
});
