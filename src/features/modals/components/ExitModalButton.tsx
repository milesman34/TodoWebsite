import { useDispatch } from "react-redux";
import { Modal, setActiveModal } from "../../../redux/todoSlice";

/**
 * This button lets you exit a modal.
 */
export const ExitModalButton = () => {
    const dispatch = useDispatch();

    // Runs when the exit modal button is clicked
    const onExitModalClicked = () => {
        dispatch(setActiveModal(Modal.None));
    };

    return (
        <button
            className="header-button exit-modal-button"
            data-testid="exit-modal-button"
            onClick={onExitModalClicked}
        >
            Exit Modal
        </button>
    );
};
