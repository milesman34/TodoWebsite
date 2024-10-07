import { useDispatch } from "react-redux";
import { setTaskPriority } from "../../../../redux/todoSlice";

/**
 * This button resets the priority of a task.
 */
export const ResetPriorityButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    return (
        <button
            className="task-button"
            data-testid={`task-priority-reset-button-${id}`}
            onClick={() =>
                dispatch(
                    setTaskPriority({
                        taskID: id,
                        priority: 0
                    })
                )
            }
        >
            Reset Priority
        </button>
    );
};
