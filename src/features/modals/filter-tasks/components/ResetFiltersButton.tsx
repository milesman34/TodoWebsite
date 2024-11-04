import { useDispatch } from "react-redux";
import { resetFilters } from "../../../../redux/todoSlice";
import classNames from "classnames";

/**
 * This button resets the current filters for tasks
 */
export const ResetFiltersButton = ({
    extraFn = () => {},
    className
}: {
    extraFn?: () => void; // Extra on-click function to pass
    className: string;
}) => {
    const dispatch = useDispatch();

    // Runs when the reset filters button is clicked
    const onResetFiltersClicked = () => {
        dispatch(resetFilters());
        extraFn();
    };

    return (
        <button
            className={classNames(className, "exit-modal-button")}
            data-testid="reset-filters-button"
            onClick={onResetFiltersClicked}
        >
            Reset Filters
        </button>
    );
};
