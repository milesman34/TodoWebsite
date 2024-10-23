import { useSelector } from "react-redux";
import "./ExportSaveModal.css";
import { selectSaveData } from "../../../redux/todoSlice";
import { ExitModalButton } from "../components/ExitModalButton";

/**
 * This modal lets the user export the save file into a data format and save to a file.
 */
export const ExportSaveModal = () => {
    const saveData = useSelector(selectSaveData);

    return (
        <div id="export-save-modal" className="modal" data-testid="export-save-modal">
            <div id="export-save-container-top">
                <div className="modal-header">Export Save</div>

                <div id="export-save-textarea-container">
                    <textarea
                        id="export-save-textarea"
                        data-testid="export-save-textarea"
                        value={saveData}
                        disabled
                    />
                </div>
            </div>

            <div id="export-modal-end-row">
                <ExitModalButton />
            </div>
        </div>
    );
};
