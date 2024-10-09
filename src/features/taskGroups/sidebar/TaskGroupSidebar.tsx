import { useDispatch, useSelector } from "react-redux";
import {
    selectActiveTaskGroupID,
    selectTaskGroups,
    selectTaskListType,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../../../redux/todoSlice";

import "./TaskGroupSidebar.css";
import { TaskGroupComponent } from "../task-group/TaskGroupComponent";
import { TaskListButton } from "./components/TaskListButton";
import { AddTaskGroupButton } from "./components/AddTaskGroupButton";
import { useEffect } from "react";

/**
 * This component contains the app sidebar, which contains the task groups
 */
export const TaskGroupSidebar = () => {
    const taskGroups = useSelector(selectTaskGroups);
    const taskListType = useSelector(selectTaskListType);
    const activeTaskGroup = useSelector(selectActiveTaskGroupID);

    const dispatch = useDispatch();

    // Update local storage whenever the task groups are updated
    useEffect(() => {
        localStorage.setItem("taskGroups", JSON.stringify(taskGroups));
    }, [taskGroups]);

    // Update local storage for the current task list type
    useEffect(() => {
        sessionStorage.setItem("taskListType", taskListType.toString());
    }, [taskListType]);

    // Update local storage for active task group
    useEffect(() => {
        sessionStorage.setItem("activeTaskGroup", activeTaskGroup);
    }, [activeTaskGroup]);

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
