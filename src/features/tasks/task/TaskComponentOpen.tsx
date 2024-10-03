import { useDispatch } from "react-redux";
import { Task } from "../Task";
import {
    addTaskTag,
    setTaskDescription,
    setTaskName,
    setTaskPriority,
    setTaskTags
} from "../../../redux/todoSlice";
import { TaskPriorityAddButton } from "./priority-add/TaskPriorityAddButton";
import { TaskTagComponent } from "./tag/TaskTagComponent";

/**
 * This contains the part of the TaskComponent that displays when the task is open
 */
export const TaskComponentOpen = ({ task }: { task: Task }) => {
    const dispatch = useDispatch();

    // Runs when the edit name button is clicked
    const onEditNameClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
            dispatch(
                setTaskName({
                    taskID: task.id,
                    name: taskName
                })
            );
        }
    };

    // Runs when the description is changed
    const onDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(
            setTaskDescription({
                taskID: task.id,
                description: event.target.value
            })
        );
    };

    // Runs when the set task priority button is clicked
    const onSetPriorityClicked = () => {
        const priorityString = prompt("Enter task priority")?.trim();

        if (priorityString === "" || priorityString === undefined) {
            return;
        }

        const priorityParsed = parseFloat(priorityString);

        if (isNaN(priorityParsed)) {
            return;
        }

        dispatch(
            setTaskPriority({
                taskID: task.id,
                priority: priorityParsed
            })
        );
    };

    // Runs when the add tag button is clicked
    const onAddTagClicked = () => {
        const tagString = prompt("Enter tag name")?.trim();

        if (tagString === "" || tagString === undefined) {
            return;
        }

        dispatch(
            addTaskTag({
                taskID: task.id,
                tag: tagString
            })
        );
    };

    // Runs when the reset tags button is clicked
    const onResetTagsClicked = () => {
        if (confirm("Do you really want to reset the tags?")) {
            dispatch(
                setTaskTags({
                    taskID: task.id,
                    tags: []
                })
            );
        }
    };

    return (
        <div className="task-body" data-testid={`task-body-${task.id}`}>
            <button
                className="task-button"
                data-testid={`edit-name-task-button-${task.id}`}
                onClick={onEditNameClicked}
            >
                Edit Name
            </button>

            <div className="task-description-container">
                <div className="task-description-label">Description:</div>

                <textarea
                    className="task-description-textarea"
                    data-testid={`task-description-textarea-${task.id}`}
                    aria-label="task-description"
                    rows={5}
                    cols={30}
                    onChange={onDescriptionChanged}
                    value={task.description}
                ></textarea>
            </div>

            <div className="task-priority-container">
                <div
                    className="task-priority-label"
                    data-testid={`task-priority-label-${task.id}`}
                >
                    Priority: {task.priority}
                </div>

                <div className="flex-column-center">
                    <button
                        className="task-button"
                        data-testid={`task-priority-set-button-${task.id}`}
                        onClick={onSetPriorityClicked}
                    >
                        Set Priority
                    </button>
                </div>

                <div className="task-priority-adders">
                    {[-10, -5, -1, 1, 5, 10].map((value) => (
                        <TaskPriorityAddButton
                            key={value}
                            taskID={task.id}
                            amount={value}
                        />
                    ))}
                </div>

                <div className="flex-column-center">
                    <button
                        className="task-button"
                        data-testid={`task-priority-reset-button-${task.id}`}
                        onClick={() =>
                            dispatch(
                                setTaskPriority({
                                    taskID: task.id,
                                    priority: 0
                                })
                            )
                        }
                    >
                        Reset Priority
                    </button>
                </div>
            </div>

            <div className="task-tags-container">
                <div className="task-tags-label">Tags:</div>

                <div className="task-tags-list" data-testid={`task-tags-list-${task.id}`}>
                    {task.tags.map((tag) => (
                        <TaskTagComponent key={tag} taskID={task.id} tag={tag} />
                    ))}
                </div>

                <div className="task-add-tag-button-container">
                    <button
                        className="task-button"
                        data-testid={`task-add-tag-button-${task.id}`}
                        onClick={onAddTagClicked}
                    >
                        Add Tag
                    </button>

                    <button
                        className="task-button-nomargin"
                        data-testid={`task-reset-tags-button-${task.id}`}
                        onClick={onResetTagsClicked}
                    >
                        Reset Tags
                    </button>
                </div>
            </div>
        </div>
    );
};
