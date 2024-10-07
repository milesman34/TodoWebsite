import { useDispatch, useSelector } from "react-redux";
import "./TasksContainer.css";
import {
    deleteTaskGroup,
    selectActiveTaskGroup,
    selectTaskListType,
    selectTasksInCurrentTaskList,
    TaskListType
} from "../../../redux/todoSlice";
import { TaskComponent } from "../task/TaskComponent";
import { useState } from "react";
import { AddTaskButton } from "./components/AddTaskButton";
import { EditNameButton } from "./components/EditNameButton";
import { TaskGroupDescription } from "./components/TaskGroupDescription";

/**
 * TasksContainer contains the list of tasks, as well as related features
 * @returns
 */
export const TasksContainer = () => {
    const taskListType = useSelector(selectTaskListType);
    const activeTaskGroup = useSelector(selectActiveTaskGroup);
    const tasks = useSelector(selectTasksInCurrentTaskList);

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
                    taskGroupID: activeTaskGroup?.id || "",
                    preserveTasks
                })
            );
        }
    };

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
