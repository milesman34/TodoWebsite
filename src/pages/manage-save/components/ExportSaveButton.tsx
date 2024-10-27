import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Modal, selectActiveModal, setActiveModal } from "../../../redux/todoSlice";

/**
 * This button exports the save data to a file.
 */
export const ExportSaveButton = () => {
    const dispatch = useDispatch();

    const activeModal = useSelector(selectActiveModal);
    const isActive = activeModal === Modal.ExportSave;

    // Runs when the export save button is clicked
    const onExportSaveClicked = () => {
        dispatch(setActiveModal(isActive ? Modal.None : Modal.ExportSave));
    };

    return (
        <button
            className={classNames(
                "header-button",
                isActive ? "modal-button-active" : "modal-button"
            )}
            data-testid="export-save-button"
            onClick={onExportSaveClicked}
        >
            Export Save
        </button>
    );
};
