import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTaskGroup,
    selectActiveTaskGroup,
    selectActiveTaskGroupID,
    selectOpenTaskIDs,
    selectTaskIDs,
    selectTaskListType,
    selectTasksInCurrentTaskList,
    TaskListType
} from "../../../redux/todoSlice";
import { saveOpenTaskIDs, saveTaskIDs } from "../../../utils/storageTools";
import { TaskComponent } from "../task/TaskComponent";
import { AddTaskButton } from "./components/AddTaskButton";
import { EditNameButton } from "./components/EditNameButton";
import { TaskGroupDescription } from "./components/TaskGroupDescription";
import "./TasksContainer.css";

/**
 * TasksContainer contains the list of tasks, as well as related features
 * @returns
 */
export const TasksContainer = () => {
    const taskListType = useSelector(selectTaskListType);
    const activeTaskGroup = useSelector(selectActiveTaskGroup);
    const activeTaskGroupID = useSelector(selectActiveTaskGroupID);
    const tasks = useSelector(selectTasksInCurrentTaskList);
    const taskIDs = useSelector(selectTaskIDs);
    const openTaskIDs = useSelector(selectOpenTaskIDs);

    // Are we in a task group?
    const inTaskGroup = activeTaskGroup !== undefined;

    const dispatch = useDispatch();

    // Is it set to preserve tasks when deleted?
    const [preserveTasks, setPreserveTasks] = useState(true);

    // Runs when the delete group button is clicked
    const onDeleteGroupClicked = () => {
        if (confirm("Do you really want to delete this task group?")) {
            dispatch(
                deleteTaskGroup({
                    taskGroupID: activeTaskGroupID,
                    preserveTasks
                })
            );
        }
    };

    // Save the list of task IDs
    useEffect(() => {
        saveTaskIDs(taskIDs);
    }, [taskIDs]);

    // Save the list of open task IDs
    useEffect(() => {
        saveOpenTaskIDs(openTaskIDs);
    }, [openTaskIDs]);

    return (
        <div id="tasks-container">
            <div className="flex-row">
                <div id="tasks-type-text" data-testid="tasks-type-text">
                    {taskListType === TaskListType.All
                        ? "All Tasks"
                        : taskListType === TaskListType.Ungrouped
                        ? "Ungrouped Tasks"
                        : activeTaskGroup?.name}
                </div>

                {inTaskGroup && (
                    <div className="flex-row">
                        <EditNameButton />

                        <button
                            id="group-delete-button"
                            data-testid="group-delete-button"
                            onClick={onDeleteGroupClicked}
                        >
                            Delete Group
                        </button>

                        <div id="preserve-tasks-checkbox-container">
                            <input
                                type="checkbox"
                                id="preserve-tasks-checkbox"
                                data-testid="preserve-tasks-checkbox"
                                title="preserve-tasks"
                                checked={preserveTasks}
                                onChange={() => setPreserveTasks(!preserveTasks)}
                            />

                            <label htmlFor="preserve-tasks" id="preserve-tasks-label">
                                Keep tasks when deleted?
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {inTaskGroup && <TaskGroupDescription taskGroup={activeTaskGroup} />}

            <AddTaskButton taskGroup={activeTaskGroup} />

            <div id="task-components-container" data-testid="task-components-container">
                {tasks.map((task) => (
                    <TaskComponent key={task.id} taskID={task.id} />
                ))}
            </div>
        </div>
    );
};
