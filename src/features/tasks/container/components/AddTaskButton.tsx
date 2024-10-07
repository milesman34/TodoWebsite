import { useDispatch } from "react-redux";
import { addTask } from "../../../../redux/todoSlice";
import { Task } from "../../Task";
import { nanoid } from "nanoid";
import { TaskGroup } from "../../../taskGroups/TaskGroup";

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
        }
    };

    return (
        <button
            id="add-task-button"
            data-testid="add-task-button"
            onClick={onAddTaskButtonClicked}
        >
            Add Task
        </button>
    );
};
