import { useDispatch } from "react-redux";
import { setTaskName } from "../../../../redux/todoSlice";

/**
 * This button edits the name of the task.
 */
export const EditNameButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    // Runs when the edit name button is clicked
    const onEditNameClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
            dispatch(
                setTaskName({
                    taskID: id,
                    name: taskName
                })
            );
        }
    };

    return (
        <button
            className="task-button"
            data-testid={`edit-name-task-button-${id}`}
            onClick={onEditNameClicked}
        >
            Edit Name
        </button>
    );
};
