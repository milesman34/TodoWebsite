import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDetectKeydown } from "../../../hooks/useDetectKeydown";
import {
    Modal,
    Operator,
    selectFilterDescription,
    selectFilterName,
    selectFilterPriorityOperator,
    selectFilterPriorityThreshold,
    setActiveModal,
    setFilterDescription,
    setFilterName,
    setFilterPriorityOperator,
    setFilterPriorityThreshold
} from "../../../redux/todoSlice";
import { ExitModalButton } from "../components/ExitModalButton";
import { ResetFiltersButton } from "./components/ResetFiltersButton";

// Map priority operators to text and vice versa
const operatorToText: Record<Operator, string> = {
    [Operator.None]: "",
    [Operator.Equals]: "=",
    [Operator.NotEquals]: "!=",
    [Operator.LessThan]: "<",
    [Operator.GreaterThan]: ">",
    [Operator.LessOrEqual]: "<=",
    [Operator.GreaterOrEqual]: ">="
};

const textToOperator: Record<string, Operator> = {
    "": Operator.None,
    "=": Operator.Equals,
    "!=": Operator.NotEquals,
    "<": Operator.LessThan,
    ">": Operator.GreaterThan,
    "<=": Operator.LessOrEqual,
    ">=": Operator.GreaterOrEqual
};

/**
 * This modal lets the user configure how tasks are filtered.
 */
export const FilterTasksModal = () => {
    const dispatch = useDispatch();

    const filterName = useSelector(selectFilterName);
    const filterDescription = useSelector(selectFilterDescription);
    const filterPriority = useSelector(selectFilterPriorityThreshold);
    const filterPriorityOperator = useSelector(selectFilterPriorityOperator);

    // Name to filter by
    const [name, setName] = useState(filterName);

    // Description to filter by
    const [description, setDescription] = useState(filterDescription);

    // Priority to filter by
    const [priority, setPriority] = useState(filterPriority.toString());

    // Priority operator to use
    const [priorityOperator, setPriorityOperator] = useState(
        operatorToText[filterPriorityOperator]
    );

    useDetectKeydown("Escape", () => dispatch(setActiveModal(Modal.None)));

    // Extra function to call when the ResetFiltersButton is clicked to clear out the textboxes and reset other UI elements
    const resetUIElements = () => {
        setName("");
        setDescription("");
        setPriority("0");
        setPriorityOperator("");
    };

    // Button that sets the filters
    const onSetFiltersClicked = () => {
        dispatch(setFilterName(name));
        dispatch(setFilterDescription(description));

        const prioThreshold = parseFloat(priority);

        if (isNaN(prioThreshold)) {
            dispatch(setFilterPriorityThreshold(0));
            setPriority("0");
        } else {
            dispatch(setFilterPriorityThreshold(prioThreshold));
        }

        dispatch(setFilterPriorityOperator(textToOperator[priorityOperator]));
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

                <div className="filter-modal-row">
                    <label className="filter-modal-row-label">
                        Filter by Description:
                    </label>

                    <input
                        className="filter-modal-row-input"
                        data-testid="filter-modal-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                <div className="filter-modal-row">
                    <label className="filter-modal-row-label">Filter by Priority:</label>

                    <select
                        className="filter-modal-prio-operator-select"
                        data-testid="filter-modal-prio-operator-select"
                        value={priorityOperator}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                            setPriorityOperator(event.target.value)
                        }
                    >
                        <option value=""></option>
                        <option value="=">=</option>
                        <option value="!=">!=</option>
                        <option value="<">{"<"}</option>
                        <option value=">">{">"}</option>
                        <option value="<=">{"<="}</option>
                        <option value=">=">{">="}</option>
                    </select>

                    <input
                        className="filter-modal-row-prio-input"
                        data-testid="filter-modal-priority"
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
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
