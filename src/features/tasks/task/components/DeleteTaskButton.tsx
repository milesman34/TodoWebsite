import { useDispatch } from "react-redux";
import { deleteTask } from "../../../../redux/todoSlice";

/**
 * This button deletes the current task.
 */
export const DeleteTaskButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    // Runs when the delete button is clicked
    const onDeleteClicked = () => {
        if (confirm("Do you really want to delete this task?")) {
            dispatch(deleteTask(id));
        }
    };

    return (
        <button
            className="task-button-delete"
            data-testid={`delete-task-button-${id}`}
            onClick={onDeleteClicked}
        >
            Delete
        </button>
    );
};
