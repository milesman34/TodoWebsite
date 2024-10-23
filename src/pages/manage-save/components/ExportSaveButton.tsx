import { useDispatch } from "react-redux";
import { Modal, setActiveModal } from "../../../redux/todoSlice";

/**
 * This button exports the save data to a file.
 */
export const ExportSaveButton = () => {
    const dispatch = useDispatch();

    // Runs when the export save button is clicked
    const onExportSaveClicked = () => {
        dispatch(setActiveModal(Modal.ExportSave));
    };

    return (
        <button
            className="header-button"
            data-testid="export-save-button"
            onClick={onExportSaveClicked}
        >
            Export Save
        </button>
    );
};
