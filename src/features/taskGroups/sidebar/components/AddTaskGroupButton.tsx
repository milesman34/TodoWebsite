import { nanoid } from "nanoid";
import { addTaskGroup } from "../../../../redux/todoSlice";
import { useDispatch } from "react-redux";

/**
 * This button lets the user add a new task group.
 */
export const AddTaskGroupButton = () => {
    const dispatch = useDispatch();

    // Runs when the add task group button is clicked
    const onClick = () => {
        const taskGroupName = prompt("Enter task group name")?.trim();

        // Add a new task with this name
        if (!(taskGroupName === "" || taskGroupName === undefined)) {
            dispatch(
                addTaskGroup({
                    name: taskGroupName,
                    description: "",
                    id: nanoid()
                })
            );
        }
    };

    return (
        <button
            id="add-task-group-button"
            data-testid="add-task-group-button"
            onClick={onClick}
        >
            Add Task Group
        </button>
    );
};
