import { useDispatch, useSelector } from "react-redux";
import { Modal, selectActiveModal, setActiveModal } from "../../../redux/todoSlice";
import classNames from "classnames";

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
    const dispatch = useDispatch();

    const activeModal = useSelector(selectActiveModal);
    const isActive = activeModal === modal;

    // Runs when the modal button is clicked
    const onModalButtonClicked = () => {
        dispatch(setActiveModal(isActive ? Modal.None : modal));
    };

    return (
        <button
            className={classNames(
                "header-button",
                isActive ? "modal-button-active" : "modal-button"
            )}
            data-testid={`${id}-button`}
            onClick={onModalButtonClicked}
        >
            {displayText}
        </button>
    );
};
