/**
 * This button lets you open a modal.
 */
import { useDispatch, useSelector } from "react-redux";
import { Modal, selectActiveModal, setActiveModal } from "../../../redux/todoSlice";
import classNames from "classnames";

/**
 * This button opens one of the modals for saving.
 */
export const ModalButton = ({
    modal,
    displayText,
    id,
    className
}: {
    modal: Modal;
    displayText: string;
    id: string;
    className: string;
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
                className,
                isActive ? "modal-button-active" : "modal-button"
            )}
            data-testid={`${id}-button`}
            onClick={onModalButtonClicked}
        >
            {displayText}
        </button>
    );
};
