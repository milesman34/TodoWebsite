import { useSelector } from "react-redux";
import { Modal, selectActiveModal } from "../../redux/todoSlice";
import { ExportSaveModal } from "./export-save/ExportSaveModal";
import "./ModalManager.css";

/**
 * This component manages active modals
 */
export const ModalManager = () => {
    const modal = useSelector(selectActiveModal);

    return (
        <div id="modal-manager">{modal === Modal.ExportSave && <ExportSaveModal />}</div>
    );
};
