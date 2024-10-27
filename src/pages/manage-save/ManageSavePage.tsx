import { SaveButton } from "../../features/header/components/SaveButton";
import { Modal } from "../../redux/todoSlice";
import "./ManageSavePage.css";
import { ResetSaveButton } from "./components/ResetSaveButton";
import { SaveModalButton } from "./components/SaveModalButton";

/**
 * This page manages the save file.
 */
export const ManageSavePage = () => {
    return (
        <div id="manage-save-container" data-testid="manage-save-page">
            <div id="manage-save-header">Manage Save</div>

            <div className="save-row">
                <SaveButton />
                <ResetSaveButton />
            </div>

            <div className="save-row">
                <SaveModalButton
                    modal={Modal.ExportSave}
                    displayText="Export Save"
                    id="export-save"
                />
                
                <SaveModalButton
                    modal={Modal.ImportSave}
                    displayText="Import Save"
                    id="import-save"
                />
            </div>
        </div>
    );
};
