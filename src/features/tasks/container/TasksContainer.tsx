import { useSelector } from "react-redux";
import "./TasksContainer.css";
import {
    selectActiveTaskGroup,
    selectTaskListType,
    TaskListType
} from "../../../redux/todoSlice";

/**
 * TasksContainer contains the list of tasks, as well as related features
 * @returns
 */
export const TasksContainer = () => {
    const taskListType = useSelector(selectTaskListType);
    const activeTaskGroup = useSelector(selectActiveTaskGroup);

    return (
        <div id="tasks-container">
            <div id="tasks-type-text" data-testid="tasks-type-text">
                {taskListType === TaskListType.All
                    ? "All Tasks"
                    : taskListType === TaskListType.Ungrouped
                    ? "Ungrouped Tasks"
                    : activeTaskGroup?.name}
            </div>
        </div>
    );
};
