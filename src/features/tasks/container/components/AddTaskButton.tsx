import { nanoid } from "nanoid";
import { useDispatch } from "react-redux";
import { addTask, resetFilters } from "../../../../redux/todoSlice";
import { TaskGroup } from "../../../taskGroups/TaskGroup";
import { Task } from "../../Task";

/**
 * This component adds a task to the task group
 */
export const AddTaskButton = ({
    taskGroup
}: {
    taskGroup?: TaskGroup; // Current task group
}) => {
    const dispatch = useDispatch();

    // Runs when the add task button is clicked
    const onAddTaskButtonClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
            // If we are in All Tasks or Ungrouped Tasks, then this is an ungrouped task, so just have an empty active task group id
            dispatch(
                addTask(
                    Task({
                        name: taskName,
                        id: nanoid(),
                        taskGroupID: taskGroup === undefined ? "" : taskGroup.id
                    })
                )
            );

            // Disable filters as well, because it is bad to have the user think that creating a task didn't work
            dispatch(resetFilters());
        }
    };

    return (
        <button
            id="add-task-button"
            data-testid="add-task-button"
            className="tasks-controls-button"
            onClick={onAddTaskButtonClicked}
        >
            Add Task
        </button>
    );
};
