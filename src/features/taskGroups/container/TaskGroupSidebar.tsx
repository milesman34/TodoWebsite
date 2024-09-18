import { useSelector } from "react-redux";
import { selectTaskGroups } from "../taskGroupSlice";

import "./TaskGroupSidebar.css";

/**
 * This component contains the app sidebar, which contains the task groups
 */
export const TaskGroupSidebar = () => {
    const taskGroups = useSelector(selectTaskGroups);

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
                <button id="add-task-group-button">
                    Add
                </button>

                {taskGroups.map((taskGroup) => (
                    <div key={taskGroup.id}>{taskGroup.name}</div>
                ))}
            </div>
        </div>
    );
};
