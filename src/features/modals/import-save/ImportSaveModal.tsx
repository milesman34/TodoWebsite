import { nanoid } from "nanoid";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDetectKeydown } from "../../../hooks/useDetectKeydown";
import {
    Modal,
    pushNotification,
    setActiveModal,
    setGroups,
    setTasks
} from "../../../redux/todoSlice";
import { loadFromSaveText } from "../../../utils/storageTools";
import { AppNotification } from "../../notifications/AppNotification";
import { ExitModalButton } from "../components/ExitModalButton";

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
            setParseError("The save text was empty!");
            return;
        }

        try {
            const parsed = JSON.parse(saveText);

            if (!("tasks" in parsed)) {
                setParseError("Save data missing tasks!");
                return;
            } else if (!("taskGroups" in parsed)) {
                setParseError("Save data missing task groups!");
                return;
            }
        } catch {
            setParseError("There was an error parsing the save data!");
            return;
        }

        const loadedData = loadFromSaveText(saveText);

        dispatch(setTasks(loadedData.tasks));
        dispatch(setGroups(loadedData.taskGroups));

        setParseError("");

        dispatch(
            pushNotification(
                AppNotification({
                    id: nanoid(),
                    text: "Imported save data"
                })
            )
        );
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
                        data-testid="import-save-textarea"
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
