import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
    AppPage,
    Modal,
    selectCurrentPage,
    setActiveModal,
    setCurrentPage
} from "../../../redux/todoSlice";

/**
 * The PageButton lets the user navigate to a specific page, or navigate backwards once they are there
 */
export const PageButton = ({
    text,
    page
}: {
    text: string; // Text of the button
    page: AppPage; // Page the button links to
}) => {
    const dispatch = useDispatch();

    const currentPage = useSelector(selectCurrentPage);
    const isCurrent = currentPage === page;

    // Runs when the page button is clicked
    const onPageButtonClicked = () => {
        // Modals should be closed on page changes regardless
        dispatch(setActiveModal(Modal.None));

        dispatch(setCurrentPage(isCurrent ? AppPage.Main : page));
    };

    return (
        <button
            className={classNames("page-button", isCurrent ? "page-button-active" : "")}
            data-testid={`page-button-${text}`}
            onClick={onPageButtonClicked}
        >
            {isCurrent ? "Return Home" : text}
        </button>
    );
};
