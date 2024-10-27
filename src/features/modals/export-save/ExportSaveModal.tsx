import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { useDetectKeydown } from "../../../hooks/useDetectKeydown";
import {
    Modal,
    pushNotification,
    selectSaveData,
    setActiveModal
} from "../../../redux/todoSlice";
import { download } from "../../../utils/storageTools";
import { AppNotification } from "../../notifications/AppNotification";
import { ExitModalButton } from "../components/ExitModalButton";

/**
 * This modal lets the user export the save file into a data format and save to a file.
 */
export const ExportSaveModal = () => {
    const saveData = useSelector(selectSaveData);
    const dispatch = useDispatch();

    // Runs when the copy clipboard button is clicked
    const onCopyClipboardClicked = () => {
        navigator.clipboard.writeText(saveData);

        dispatch(
            pushNotification(
                AppNotification({
                    text: "Copied to clipboard",
                    id: nanoid()
                })
            )
        );
    };

    // Runs when the export file button is clicked
    const onExportFileClicked = () => {
        const filename = `todo-save-${Date.now().toString().replaceAll(" ", "_")}`;

        download(filename, saveData);

        // Add a new notification
        dispatch(
            pushNotification(
                AppNotification({
                    text: "Saved to file",
                    id: nanoid()
                })
            )
        );
    };

    // Exit out of modal when escape is pressed
    useDetectKeydown("Escape", () => dispatch(setActiveModal(Modal.None)));

    return (
        <div className="modal save-modal" data-testid="export-save-modal">
            <div className="save-modal-container-top">
                <div className="modal-header">Export Save</div>

                <div className="save-modal-textarea-container">
                    <textarea
                        className="save-modal-textarea"
                        data-testid="export-save-textarea"
                        value={saveData}
                        disabled
                    />
                </div>
            </div>

            <div className="save-modal-end-row">
                <ExitModalButton />

                <button
                    className="header-button"
                    data-testid="export-save-copy-clipboard-button"
                    onClick={onCopyClipboardClicked}
                >
                    Copy to Clipboard
                </button>

                <button
                    className="header-button"
                    data-testid="export-save-file-button"
                    onClick={onExportFileClicked}
                >
                    Export to File
                </button>
            </div>
        </div>
    );
};
