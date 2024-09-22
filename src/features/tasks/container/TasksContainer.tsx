import { useDispatch, useSelector } from "react-redux";
import "./TasksContainer.css";
import {
    addTask,
    selectActiveTaskGroup,
    selectTaskListType,
    selectTasksInCurrentTaskList,
    setActiveTaskGroupDescription,
    setActiveTaskGroupName,
    TaskListType
} from "../../../redux/todoSlice";
import { Task } from "../Task";
import { nanoid } from "nanoid";
import { TaskComponent } from "../task/TaskComponent";
import React from "react";

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

    // Runs when the add task button is clicked
    const onAddTaskButtonClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
            // If we are in All Tasks or Ungrouped Tasks, then this is an ungrouped task, so just have an empty active task group id
            dispatch(
                addTask(
                    Task(
                        taskName,
                        "",
                        nanoid(),
                        activeTaskGroup === undefined ? "" : activeTaskGroup.id,
                        0,
                        []
                    )
                )
            );
        }
    };

    // Runs when the edit title button is clicked
    const onEditTitleButtonClicked = () => {
        const groupName = prompt("Enter task group name")?.trim();

        if (!(groupName === "" || groupName === undefined)) {
            dispatch(setActiveTaskGroupName(groupName));
        }
    };

    // Runs when the group description is changed
    const onGroupDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setActiveTaskGroupDescription(event.target.value));
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
                    <button
                        id="group-edit-title-button"
                        data-testid="group-edit-title-button"
                        onClick={onEditTitleButtonClicked}
                    >
                        Edit Title
                    </button>
                )}
            </div>

            {inTaskGroup && (
                <div
                    id="group-description-container"
                    data-testid="group-description-container"
                >
                    <div id="group-description-label">Description:</div>

                    <textarea
                        id="group-description-textarea"
                        data-testid="group-description-textarea"
                        aria-label="group-description"
                        rows={2}
                        cols={50}
                        onChange={onGroupDescriptionChanged}
                        value={activeTaskGroup.description}
                    ></textarea>
                </div>
            )}

            <button
                id="add-task-button"
                data-testid="add-task-button"
                onClick={onAddTaskButtonClicked}
            >
                Add Task
            </button>

            <div id="task-components-container" data-testid="task-components-container">
                {tasks.map((task) => (
                    <TaskComponent key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};
