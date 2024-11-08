import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTaskGroup,
    Modal,
    selectActiveTaskGroup,
    selectActiveTaskGroupID,
    selectFilterDescription,
    selectFilterName,
    selectFilterPriorityOperator,
    selectFilterPriorityThreshold,
    selectFiltersAreDefault,
    selectFilterTags,
    selectOpenTaskIDs,
    selectTaskIDs,
    selectTaskListType,
    selectTasksInCurrentTaskList,
    TaskListType
} from "../../../redux/todoSlice";
import {
    saveFilterDescription,
    saveFilterName,
    saveFilterPriorityOperator,
    saveFilterPriorityThreshold,
    saveFilterTags,
    saveOpenTaskIDs,
    saveTaskIDs
} from "../../../utils/storageTools";
import { ModalButton } from "../../modals/components/ModalButton";
import { ResetFiltersButton } from "../../modals/filter-tasks/components/ResetFiltersButton";
import { TaskComponent } from "../task/TaskComponent";
import { AddTaskButton } from "./components/AddTaskButton";
import { DeleteAllTasksButton } from "./components/DeleteAllTasksButton";
import { EditNameButton } from "./components/EditNameButton";
import { SortSelectorButton } from "./components/SortSelectorButton";
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
    const filterName = useSelector(selectFilterName);
    const filterDescription = useSelector(selectFilterDescription);
    const filterPriorityThreshold = useSelector(selectFilterPriorityThreshold);
    const filterPriorityOperator = useSelector(selectFilterPriorityOperator);
    const filterTags = useSelector(selectFilterTags);

    // Are we in a task group?
    const inTaskGroup = activeTaskGroup !== undefined;

    // Are any filters on?
    const areFiltersOn = useSelector(selectFiltersAreDefault);

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

    // Handles saving filtering data to session storage
    useEffect(() => {
        saveFilterName(filterName);
    }, [filterName]);

    useEffect(() => {
        saveFilterDescription(filterDescription);
    }, [filterDescription]);

    useEffect(() => {
        saveFilterPriorityThreshold(filterPriorityThreshold);
    }, [filterPriorityThreshold]);

    useEffect(() => {
        saveFilterPriorityOperator(filterPriorityOperator);
    }, [filterPriorityOperator]);

    useEffect(() => {
        saveFilterTags(filterTags);
    }, [filterTags]);

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

            <div className="tasks-container-controls-row-2">
                <AddTaskButton taskGroup={activeTaskGroup} />

                <SortSelectorButton />

                <ModalButton
                    modal={Modal.FilterTasks}
                    displayText={
                        areFiltersOn ? "Filter Tasks" : `Filter Tasks (${tasks.length})`
                    }
                    id="filter-tasks"
                    className="tasks-controls-button filter-tasks-button"
                />

                <ResetFiltersButton className="tasks-controls-button" />

                {taskListType !== TaskListType.Ungrouped && (
                    <DeleteAllTasksButton
                        taskListType={taskListType}
                        taskGroupID={activeTaskGroupID}
                    />
                )}
            </div>

            <div id="task-components-container" data-testid="task-components-container">
                {tasks.map((task) => (
                    <TaskComponent key={task.id} taskID={task.id} />
                ))}
            </div>
        </div>
    );
};
