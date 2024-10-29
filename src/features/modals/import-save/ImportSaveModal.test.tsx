import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { nanoid } from "nanoid";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import { createStore } from "../../../redux/store";
import {
    Modal,
    setActiveModal,
    setActiveTaskGroup,
    TaskListType
} from "../../../redux/todoSlice";
import {
    clickButton,
    enterText,
    getTextContent,
    makeJSONTypable,
    mockNanoid
} from "../../../utils/testUtils";
import { AppNotification } from "../../notifications/AppNotification";
import { TaskGroup } from "../../taskGroups/TaskGroup";
import { formatTaskForStorage, Task } from "../../tasks/Task";
import { ImportSaveModal } from "./ImportSaveModal";

describe("ImportSaveModal", () => {
    test("Exit out of modal when escape pressed", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ImportSave));

        render(
            <Provider store={store}>
                <ImportSaveModal />
            </Provider>
        );

        await userEvent.keyboard("{Escape}");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });

    test("Exit modal when exit modal button pressed", async () => {
        const store = createStore();

        store.dispatch(setActiveModal(Modal.ImportSave));

        render(
            <Provider store={store}>
                <ImportSaveModal />
            </Provider>
        );

        await clickButton("exit-modal-button");

        expect(store.getState().activeModal).toEqual(Modal.None);
    });

    describe("ImportFromText button", () => {
        test("Text is empty", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await clickButton("import-from-text-button");

            expect(store.getState().tasks).toEqual([]);
            expect(store.getState().groups).toEqual([]);
            expect(getTextContent("parse-error-text")).toBe("The save text was empty!");
        });

        test("Error parsing data", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await enterText("import-save-textarea", "[[[[[[");

            await clickButton("import-from-text-button");

            expect(store.getState().tasks).toEqual([]);
            expect(store.getState().groups).toEqual([]);
            expect(getTextContent("parse-error-text")).toBe(
                "There was an error parsing the save data!"
            );
        });

        test("Tasks missing", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await enterText(
                "import-save-textarea",
                makeJSONTypable(
                    JSON.stringify({
                        taskGroups: []
                    })
                )
            );

            await clickButton("import-from-text-button");

            expect(store.getState().tasks).toEqual([]);
            expect(store.getState().groups).toEqual([]);
            expect(getTextContent("parse-error-text")).toBe("Save data missing tasks!");
        });

        test("Task groups missing", async () => {
            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await enterText(
                "import-save-textarea",
                makeJSONTypable(
                    JSON.stringify({
                        tasks: []
                    })
                )
            );

            await clickButton("import-from-text-button");

            expect(store.getState().tasks).toEqual([]);
            expect(store.getState().groups).toEqual([]);
            expect(getTextContent("parse-error-text")).toBe(
                "Save data missing task groups!"
            );
        });

        test("Working data", async () => {
            mockNanoid(nanoid, "id");

            const task = formatTaskForStorage(Task({ id: "id1", name: "My task" }));
            const group = TaskGroup({ id: "id2", name: "My group" });

            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await enterText(
                "import-save-textarea",
                makeJSONTypable(
                    JSON.stringify({
                        tasks: [task],
                        taskGroups: [group]
                    })
                )
            );

            await clickButton("import-from-text-button");

            expect(store.getState().tasks).toEqual([{ ...task, isOpen: false }]);
            expect(store.getState().groups).toEqual([group]);
            expect(getTextContent("parse-error-text")).toBe("");
            expect(store.getState().notifications).toEqual([
                AppNotification({
                    id: "id",
                    text: "Imported save data"
                })
            ]);
        });

        test("Change the active task group", async () => {
            mockNanoid(nanoid, "id");

            const task = formatTaskForStorage(Task({ id: "id1", name: "My task" }));
            const group = TaskGroup({ id: "id2", name: "My group" });

            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));
            store.dispatch(setActiveTaskGroup("id3"));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await enterText(
                "import-save-textarea",
                makeJSONTypable(
                    JSON.stringify({
                        tasks: [task],
                        taskGroups: [group]
                    })
                )
            );

            await clickButton("import-from-text-button");

            expect(store.getState().activeTaskGroup).toBe("");
            expect(store.getState().taskListType).toEqual(TaskListType.All);
        });
    });

    describe("ImportFromFile button", () => {
        const mockUpload = async (mockText: string) => {
            vi.doMock("../../../utils/storageTools.ts", async (importOriginal) => {
                const mod = await importOriginal<
                    typeof import("../../../utils/storageTools.ts")
                >();

                return {
                    ...mod,

                    // Replace uploadAndCall
                    uploadAndCall: async (
                        _types: string[],
                        fn: (saveText: string) => Promise<void>
                    ) => {
                        console.log("calling fn");
                        await fn(mockText);
                        console.log("called fn");
                    }
                };
            });
        };

        test("File is empty", async () => {
            await mockUpload("");

            const store = createStore();

            store.dispatch(setActiveModal(Modal.ImportSave));

            render(
                <Provider store={store}>
                    <ImportSaveModal />
                </Provider>
            );

            await clickButton("import-from-file-button");

            console.log("click button");

            await new Promise((resolve) => setTimeout(resolve, 1000));

            expect(store.getState().tasks).toEqual([]);
            expect(store.getState().groups).toEqual([]);
            expect(getTextContent("parse-error-text")).toBe("The save text was empty!");
        });
    });
});
