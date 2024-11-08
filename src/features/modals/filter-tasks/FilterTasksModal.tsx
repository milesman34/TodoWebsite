import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDetectKeydown } from "../../../hooks/useDetectKeydown";
import {
    addFilterTag,
    Modal,
    Operator,
    resetFilters,
    selectFilterDescription,
    selectFilterName,
    selectFilterPriorityOperator,
    selectFilterPriorityThreshold,
    selectFilterTags,
    setActiveModal,
    setFilterDescription,
    setFilterName,
    setFilterPriorityOperator,
    setFilterPriorityThreshold,
    setFilterTags
} from "../../../redux/todoSlice";
import { ExitModalButton } from "../components/ExitModalButton";
import { FilterTag } from "./components/FilterTag";

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

    const name = useSelector(selectFilterName);
    const description = useSelector(selectFilterDescription);
    const priority = useSelector(selectFilterPriorityThreshold);
    const priorityOperator = useSelector(selectFilterPriorityOperator);
    const filterTags = useSelector(selectFilterTags);

    // Priority to filter by
    const [priorityText, setPriorityText] = useState(priority.toString());

    useDetectKeydown("Escape", () => dispatch(setActiveModal(Modal.None)));

    // Adds a tag to the filter
    const onAddTagClicked = () => {
        const tagString = prompt("Enter tag name")?.trim();

        if (tagString === "" || tagString === undefined) {
            return;
        }

        dispatch(addFilterTag(tagString));
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
                        onChange={(event) => dispatch(setFilterName(event.target.value))}
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
                        onChange={(event) =>
                            dispatch(setFilterDescription(event.target.value))
                        }
                    />
                </div>

                <div className="filter-modal-row">
                    <label className="filter-modal-row-label">Filter by Priority:</label>

                    <select
                        className="filter-modal-prio-operator-select"
                        data-testid="filter-modal-prio-operator-select"
                        value={operatorToText[priorityOperator]}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                            dispatch(
                                setFilterPriorityOperator(
                                    textToOperator[event.target.value]
                                )
                            )
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
                        value={priorityText}
                        onChange={(event) => {
                            setPriorityText(event.target.value);

                            const prioThreshold = parseFloat(event.target.value);

                            if (isNaN(prioThreshold)) {
                                dispatch(setFilterPriorityThreshold(0));
                            } else {
                                dispatch(setFilterPriorityThreshold(prioThreshold));
                            }
                        }}
                    />
                </div>

                <label className="filter-modal-row-label">Filter by Tags:</label>

                <div className="task-tags-list filter-tags-list" data-testid="filter-tags-list">
                    {filterTags.map((tag) => (
                        <FilterTag key={tag} tag={tag} />
                    ))}
                </div>

                <div className="flex-row">
                    <button
                        className="task-button"
                        data-testid="add-filter-tag-button"
                        onClick={onAddTagClicked}
                    >
                        Add Tag
                    </button>

                    <button
                        className="task-button"
                        data-testid="reset-filter-tags-button"
                        onClick={() => dispatch(setFilterTags([]))}
                    >
                        Reset Tags
                    </button>
                </div>
            </div>

            <div className="filter-modal-end-row">
                <ExitModalButton />

                <button
                    className="header-button exit-modal-button"
                    data-testid="reset-filters-button"
                    onClick={() => {
                        dispatch(resetFilters());
                        setPriorityText("0");
                    }}
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};
