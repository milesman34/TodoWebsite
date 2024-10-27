import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDetectKeydown } from "../../../hooks/useDetectKeydown";
import { Modal, pushNotification, setActiveModal, setGroups, setTasks } from "../../../redux/todoSlice";
import { TaskGroup } from "../../taskGroups/TaskGroup";
import { Task } from "../../tasks/Task";
import { ExitModalButton } from "../components/ExitModalButton";
import { AppNotification } from "../../notifications/AppNotification";
import { nanoid } from "nanoid";

/**
 * This modal lets the user import the save file from a file or a textbox.
 */
export const ImportSaveModal = () => {
    const dispatch = useDispatch();

    // Track the text in the textarea
    const [saveText, setSaveText] = useState("");

    // Text to display for parsing errors
    const [parseError, setParseError] = useState("");

    // Exit out of modal when escape is pressed
    useDetectKeydown("Escape", () => dispatch(setActiveModal(Modal.None)));

    // Runs when the import from text button is clicked
    const onImportFromTextClicked = () => {
        // Don't do anything if there is no text in the textarea
        if (saveText.trim() === "") {
            setParseError("The save text was empty");
            return;
        }

        try {
            const parsed: {
                tasks: Task[];
                taskGroups: TaskGroup[];
            } = JSON.parse(saveText);

            // Get the tasks and task groups from the JSON
            const tasks = parsed.tasks;
            const taskGroups = parsed.taskGroups;

            // Make sure the JSON is properly formed

            dispatch(
                setTasks(
                    tasks.map((task) => Task({
                        name: task.name,
                        id: task.id,
                        description: task.description,
                        taskGroupID: task.taskGroupID,
                        priority: task.priority,
                        tags: task.tags
                    }))
                )
            );

            dispatch(setGroups(taskGroups.map(taskGroup => TaskGroup({
                name: taskGroup.name,
                id: taskGroup.id,
                description: taskGroup.description
            }))));

            setParseError("");

            dispatch(pushNotification(AppNotification({
                id: nanoid(),
                text: "Imported save data"
            })))
        } catch {
            setParseError("There was an error parsing the save data");
        }
    };

    // Runs when the import from file button is clicked
    const onImportFromFileClicked = () => {};

    return (
        <div className="modal save-modal" data-testid="import-save-modal">
            <div className="save-modal-container-top">
                <div className="modal-header">Import Save</div>

                <div className="save-modal-textarea-container">
                    <textarea
                        className="save-modal-textarea"
                        data-testid="export-save-textarea"
                        value={saveText}
                        onChange={(event) => setSaveText(event.target.value)}
                    />
                </div>

                <div id="parse-error-text" data-testid="parse-error-text">
                    {parseError}
                </div>
            </div>

            <div className="save-modal-end-row">
                <ExitModalButton />

                <button
                    className="header-button"
                    data-testid="import-from-text-button"
                    onClick={onImportFromTextClicked}
                >
                    Import from Text
                </button>

                <button
                    className="header-button"
                    data-testid="import-from-file-button"
                    onClick={onImportFromFileClicked}
                >
                    Import from File
                </button>
            </div>
        </div>
    );
};
