import { useDispatch, useSelector } from "react-redux";
import {
    selectActiveTaskGroupID,
    selectTaskGroups,
    selectTaskListType,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "../../../redux/todoSlice";

import { useEffect } from "react";
import { saveActiveTaskGroup, saveTaskGroups, saveTaskListType } from "../../../utils/storageTools";
import { TaskGroupComponent } from "../task-group/TaskGroupComponent";
import { AddTaskGroupButton } from "./components/AddTaskGroupButton";
import { TaskListButton } from "./components/TaskListButton";
import "./TaskGroupSidebar.css";

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
        saveTaskGroups(taskGroups);
    }, [taskGroups]);

    // Update local storage for the current task list type
    useEffect(() => {
        saveTaskListType(taskListType);
    }, [taskListType]);

    // Update local storage for active task group
    useEffect(() => {
        saveActiveTaskGroup(activeTaskGroup);
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
