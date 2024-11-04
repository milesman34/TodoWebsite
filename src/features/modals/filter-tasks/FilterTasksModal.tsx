import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectFilterName,
    setFilterName
} from "../../../redux/todoSlice";
import { ExitModalButton } from "../components/ExitModalButton";
import { ResetFiltersButton } from "./components/ResetFiltersButton";

/**
 * This modal lets the user configure how tasks are filtered.
 */
export const FilterTasksModal = () => {
    const dispatch = useDispatch();

    const filterName = useSelector(selectFilterName);

    // Name to filter by
    const [name, setName] = useState(filterName);

    // Extra function to call when the ResetFiltersButton is clicked to clear out the textboxes and reset other UI elements
    const resetUIElements = () => {
        setName("");
    };

    // Button that sets the filters
    const onSetFiltersClicked = () => {
        dispatch(setFilterName(name));
    };

    return (
        <div className="modal filter-modal" data-testid="filter-tasks-modal">
            <div className="filter-modal-main">
                <div className="modal-header">Filter Tasks</div>

                <div className="filter-modal-row">
                    <label className="filter-modal-row-label">Filter by Name:</label>

                    <input
                        className="filter-modal-row-input"
                        data-testid="filter-modal-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
            </div>

            <div className="modal-end-row">
                <ExitModalButton />

                <button
                    className="header-button"
                    data-testid="set-filters-button"
                    onClick={onSetFiltersClicked}
                >
                    Set Filters
                </button>

                <ResetFiltersButton extraFn={resetUIElements} className="header-button" />
            </div>
        </div>
    );
};
