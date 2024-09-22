import { useDispatch, useSelector } from "react-redux";
import "./TasksContainer.css";
import {
    addTask,
    selectActiveTaskGroup,
    selectTaskListType,
    selectTasksInCurrentTaskList,
    TaskListType
} from "../../../redux/todoSlice";
import { Task } from "../Task";
import { nanoid } from "nanoid";
import { TaskComponent } from "../task/TaskComponent";

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

                {inTaskGroup && <div>Test</div>}
            </div>

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
