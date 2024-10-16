import { useDispatch } from "react-redux";
import { addTaskPriority } from "../../../../../redux/todoSlice";
import "./TaskPriorityAddButton.css";

/**
 * This button adds to or removes from the priority of the parent task
 * @param taskID ID of the parent task
 * @param amount Amount to be added
 */
export const TaskPriorityAddButton = ({
    taskID,
    amount
}: {
    taskID: string;
    amount: number;
}) => {
    const dispatch = useDispatch();

    return (
        <button
            className="task-priority-add-button"
            data-testid={`task-priority-add-button-${taskID}-${amount}`}
            onClick={() => dispatch(
                addTaskPriority({
                    taskID,
                    priority: amount
                })
            )}
        >
            {amount > 0 ? `+${amount}` : amount}
        </button>
    );
};
