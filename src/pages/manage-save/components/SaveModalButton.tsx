import { ModalButton } from "../../../features/modals/components/ModalButton";
import { Modal } from "../../../redux/todoSlice";

/**
 * This button opens one of the modals for saving.
 */
export const SaveModalButton = ({
    modal,
    displayText,
    id
}: {
    modal: Modal;
    displayText: string;
    id: string;
}) => {
    return (
        <ModalButton
            modal={modal}
            displayText={displayText}
            id={id}
            className="header-button"
        />
    );
};
