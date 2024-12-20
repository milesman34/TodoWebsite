import React, { useEffect, useState } from "react";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
    selectTaskSortOrder,
    selectTaskSortParam,
    setTaskSortOrder,
    setTaskSortParam,
    SortOrder,
    SortParameter
} from "../../../../redux/todoSlice";
import { saveTaskSortOrder, saveTaskSortParam } from "../../../../utils/storageTools";

/**
 * This button lets the user select which method to sort by
 */
export const SortSelectorButton = () => {
    const dispatch = useDispatch();

    const sortOrder = useSelector(selectTaskSortOrder);
    const sortParam = useSelector(selectTaskSortParam);

    // useState needs a different value to deal with the auto-saving functionality
    const [sortParamValue, setSortParamValue] = useState(
        sortParam === SortParameter.None
            ? "None"
            : sortParam === SortParameter.Name
            ? "Name"
            : "Priority"
    );

    const onSortSelectChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortParamValue(event.target.value);

        dispatch(
            setTaskSortParam(
                event.target.value === "None"
                    ? SortParameter.None
                    : event.target.value === "Name"
                    ? SortParameter.Name
                    : SortParameter.Priority
            )
        );
    };

    // Update data in sessionStorage
    useEffect(() => {
        saveTaskSortParam(sortParam);
    }, [sortParam]);

    useEffect(() => {
        saveTaskSortOrder(sortOrder);
    }, [sortOrder]);

    return (
        <div className="sort-select-container">
            <div className="sort-select-text">Sort by:</div>

            <select
                className="sort-select-button"
                data-testid="sort-select-button"
                value={sortParamValue}
                onChange={onSortSelectChanged}
            >
                <option value="None">None</option>
                <option value="Name">Name</option>
                <option value="Priority">Priority</option>
            </select>

            <button
                type="button"
                className="sort-select-direction"
                data-testid="sort-select-direction-button"
                onClick={() =>
                    dispatch(
                        setTaskSortOrder(
                            sortOrder === SortOrder.Ascending
                                ? SortOrder.Descending
                                : SortOrder.Ascending
                        )
                    )
                }
            >
                {sortOrder === SortOrder.Ascending ? (
                    <>
                        Asc. <FaArrowDownLong />
                    </>
                ) : (
                    <>
                        Desc. <FaArrowUpLong />
                    </>
                )}
            </button>
        </div>
    );
};
