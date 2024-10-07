import { useDispatch, useSelector } from "react-redux";
import {
    selectTaskGroups,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../../../redux/todoSlice";

import "./TaskGroupSidebar.css";
import { TaskGroupComponent } from "../task-group/TaskGroupComponent";
import { TaskListButton } from "./components/TaskListButton";
import { AddTaskGroupButton } from "./components/AddTaskGroupButton";

/**
 * This component contains the app sidebar, which contains the task groups
 */
export const TaskGroupSidebar = () => {
    const taskGroups = useSelector(selectTaskGroups);

    const dispatch = useDispatch();

    return (
        <div id="task-group-sidebar">
            <div id="tasks-buttons-container" className="flex-column">
                <TaskListButton
                    id="all-tasks-button"
                    taskType={TaskListType.All}
                    onClick={() => dispatch(switchToAllTasks())}
                    text="All Tasks"
                />

                <TaskListButton
                    id="ungrouped-tasks-button"
                    taskType={TaskListType.Ungrouped}
                    onClick={() => dispatch(switchToUngroupedTasks())}
                    text="Ungrouped Tasks"
                />
            </div>

            <div id="task-groups-text">Task Groups</div>

            <div id="task-groups-container" data-testid="task-groups-container">
                <AddTaskGroupButton />

                {taskGroups.map((taskGroup) => (
                    <TaskGroupComponent key={taskGroup.id} taskGroup={taskGroup} />
                ))}
            </div>
        </div>
    );
};
