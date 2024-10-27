import { SaveButton } from "../../features/header/components/SaveButton";
import "./ManageSavePage.css";
import { ExportSaveButton } from "./components/ExportSaveButton";
import { ResetSaveButton } from "./components/ResetSaveButton";

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
                <ExportSaveButton />
            </div>
        </div>
    );
};
