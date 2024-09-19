import { useDispatch, useSelector } from "react-redux";
import { addTaskGroup, selectTaskGroups } from "../taskGroupSlice";

import "./TaskGroupSidebar.css";
import { nanoid } from "nanoid";
import { TaskGroupComponent } from "../task-group/TaskGroupComponent";

/**
 * This component contains the app sidebar, which contains the task groups
 */
export const TaskGroupSidebar = () => {
    const taskGroups = useSelector(selectTaskGroups);

    const dispatch = useDispatch();

    // Runs when the add task group button is clicked
    const onAddTaskGroupClicked = () => {
        const taskGroupName = prompt("Enter name")?.trim();

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
                <button id="all-tasks-button" className="tasks-button">
                    All Tasks
                </button>

                <button id="ungrouped-tasks-button" className="tasks-button">
                    Ungrouped Tasks
                </button>
            </div>

            <div id="task-groups-text">Task Groups</div>

            <div id="task-groups-container">
                <button id="add-task-group-button" data-testid="add-task-group-button" onClick={onAddTaskGroupClicked}>
                    Add
                </button>

                {taskGroups.map((taskGroup) => (
                    <TaskGroupComponent key={taskGroup.id} taskGroup={taskGroup} />
                ))}
            </div>
        </div>
    );
};
