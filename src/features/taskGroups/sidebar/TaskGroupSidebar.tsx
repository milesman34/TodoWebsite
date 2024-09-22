import { useDispatch, useSelector } from "react-redux";
import {
    addTaskGroup,
    selectTaskGroups,
    selectTaskListType,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../../../redux/todoSlice";

import "./TaskGroupSidebar.css";
import { nanoid } from "nanoid";
import { TaskGroupComponent } from "../task-group/TaskGroupComponent";
import classNames from "classnames";

/**
 * This component contains the app sidebar, which contains the task groups
 */
export const TaskGroupSidebar = () => {
    const taskGroups = useSelector(selectTaskGroups);
    const taskListType = useSelector(selectTaskListType);

    const dispatch = useDispatch();

    // Runs when the add task group button is clicked
    const onAddTaskGroupClicked = () => {
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
        <div id="task-group-sidebar">
            <div id="tasks-buttons-container" className="flex-column">
                <button
                    id="all-tasks-button"
                    data-testid="all-tasks-button"
                    className={classNames(
                        "tasks-button",
                        taskListType === TaskListType.All ? "tasks-button-active" : ""
                    )}
                    onClick={() => dispatch(switchToAllTasks())}
                >
                    All Tasks
                </button>

                <button
                    id="ungrouped-tasks-button"
                    data-testid="ungrouped-tasks-button"
                    className={classNames(
                        "tasks-button",
                        taskListType === TaskListType.Ungrouped
                            ? "tasks-button-active"
                            : ""
                    )}
                    onClick={() => dispatch(switchToUngroupedTasks())}
                >
                    Ungrouped Tasks
                </button>
            </div>

            <div id="task-groups-text">Task Groups</div>

            <div id="task-groups-container" data-testid="task-groups-container">
                <button
                    id="add-task-group-button"
                    data-testid="add-task-group-button"
                    onClick={onAddTaskGroupClicked}
                >
                    Add Task Group
                </button>

                {taskGroups.map((taskGroup) => (
                    <TaskGroupComponent key={taskGroup.id} taskGroup={taskGroup} />
                ))}
            </div>
        </div>
    );
};
