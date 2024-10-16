import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../../redux/store";
import { pushNotification } from "../../../redux/todoSlice";
import { clickButton, containsClass, getTextContent } from "../../../utils/testUtils";
import { AppNotification } from "../AppNotification";
import { NotificationComponent } from "./NotificationComponent";

describe("NotificationComponent", () => {
    describe("NotificationComponent displays the text", () => {
        test("NotificationComponent displays the text", () => {
            const store = createStore();

            const notif = AppNotification({
                text: "My text",
                id: "id1"
            });

            store.dispatch(pushNotification(notif));

            render(
                <Provider store={store}>
                    <NotificationComponent notification={notif} />
                </Provider>
            );

            expect(getTextContent("notification-component-id1")).toBe("My text");
        });
    });

    describe("Clicking on a notification deletes it", () => {
        test("Clicking on a notification deletes it", async () => {
            const store = createStore();

            const notif = AppNotification({
                text: "My text",
                id: "id1"
            });

            store.dispatch(pushNotification(notif));

            render(
                <Provider store={store}>
                    <NotificationComponent notification={notif} />
                </Provider>
            );

            await clickButton("notification-component-id1");

            expect(store.getState().notifications).toEqual([]);
        });
    });

    describe("Notification animations", () => {
        test("After 3.5 seconds, the notification disappears", () => {
            vi.useFakeTimers();

            const store = createStore();

            const notif = AppNotification({
                text: "My text",
                id: "id1"
            });

            store.dispatch(pushNotification(notif));

            render(
                <Provider store={store}>
                    <NotificationComponent notification={notif} />
                </Provider>
            );

            // This needs to be split into 2 timers because there are 2 separate timeouts
            act(() => {
                vi.advanceTimersByTime(2500);
            });

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(store.getState().notifications).toEqual([]);

            vi.useRealTimers();
        });

        test("Animation does not appear at first", () => {
            vi.useFakeTimers();

            const store = createStore();

            const notif = AppNotification({
                text: "My text",
                id: "id1"
            });

            store.dispatch(pushNotification(notif));

            render(
                <Provider store={store}>
                    <NotificationComponent notification={notif} />
                </Provider>
            );

            expect(containsClass("notification-component-id1", "notification-fade")).toBe(
                false
            );

            vi.useRealTimers();
        });

        test("Animation appears after 2.5 seconds", () => {
            vi.useFakeTimers();

            const store = createStore();

            const notif = AppNotification({
                text: "My text",
                id: "id1"
            });

            store.dispatch(pushNotification(notif));

            render(
                <Provider store={store}>
                    <NotificationComponent notification={notif} />
                </Provider>
            );

            act(() => {
                vi.advanceTimersByTime(2500);
            });

            expect(containsClass("notification-component-id1", "notification-fade")).toBe(
                true
            );

            vi.useRealTimers();
        });
    });
});
