import { useSelector } from "react-redux";
import { Modal, selectActiveModal } from "../../redux/todoSlice";
import { ExportSaveModal } from "./export-save/ExportSaveModal";
import "./modals.css";
import { ImportSaveModal } from "./import-save/ImportSaveModal";

/**
 * This component manages active modals
 */
export const ModalManager = () => {
    const modal = useSelector(selectActiveModal);

    return (
        <div id="modal-manager">
            {modal === Modal.ExportSave && <ExportSaveModal />}
            {modal === Modal.ImportSave && <ImportSaveModal />}
        </div>
    );
};