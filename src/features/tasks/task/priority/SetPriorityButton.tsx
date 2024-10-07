import { useDispatch } from "react-redux";
import { setTaskPriority } from "../../../../redux/todoSlice";

/**
 * This button sets the priority of a task.
 */
export const SetPriorityButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    // Runs when the set task priority button is clicked
    const onSetPriorityClicked = () => {
        const priorityString = prompt("Enter task priority")?.trim();

        if (priorityString === "" || priorityString === undefined) {
            return;
        }

        const priorityParsed = parseFloat(priorityString);

        if (isNaN(priorityParsed)) {
            return;
        }

        dispatch(
            setTaskPriority({
                taskID: id,
                priority: priorityParsed
            })
        );
    };

    return (
        <button
            className="task-button"
            data-testid={`task-priority-set-button-${id}`}
            onClick={onSetPriorityClicked}
        >
            Set Priority
        </button>
    );
};
