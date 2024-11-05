import { useDispatch, useSelector } from "react-redux";
import {
    removeTasksInGroup,
    selectCountTotalTasksInList,
    setTasks,
    TaskListType
} from "../../../../redux/todoSlice";

/**
 * This button deletes all tasks in the task container.
 */
export const DeleteAllTasksButton = ({
    taskListType,
    taskGroupID
}: {
    taskListType: TaskListType;
    taskGroupID: string;
}) => {
    const dispatch = useDispatch();

    const tasksCount = useSelector(selectCountTotalTasksInList);

    // Runs when the button is clicked
    const onDeleteTasksClicked = () => {
        if (
            confirm(
                taskListType === TaskListType.TaskGroup
                    ? `Do you really want to delete all tasks (${tasksCount}) in this task group? `
                    : `Do you really want to delete all tasks (${tasksCount})`
            )
        ) {
            if (taskListType === TaskListType.TaskGroup) {
                dispatch(removeTasksInGroup(taskGroupID));
            } else {
                dispatch(setTasks([]));
            }
        }
    };

    return (
        <button
            id="delete-all-tasks-button"
            data-testid="delete-all-tasks-button"
            className="tasks-controls-button"
            onClick={onDeleteTasksClicked}
        >
            Delete All Tasks
        </button>
    );
};
