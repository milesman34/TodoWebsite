import "./TaskComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
    addTaskTag,
    selectTaskGroupNameByID,
    selectTaskListType,
    selectTaskWithID,
    setTaskDescription,
    setTaskName,
    setTaskOpen,
    setTaskPriority,
    setTaskTags,
    TaskListType
} from "../../../redux/todoSlice";
import { TaskPriorityAddButton } from "./priority-add/TaskPriorityAddButton";
import { TaskTagComponent } from "./tag/TaskTagComponent";

/**
 * Component for displaying a Task
 * This uses taskID instead of task as the parameter since otherwise it won't be updated as easily if you are testing it
 * It requires store support so that the component can actually be updated when it updates the store
 */
export const TaskComponent = ({ taskID }: { taskID: string }) => {
    const dispatch = useDispatch();

    const thisTask = useSelector(selectTaskWithID(taskID));

    const taskListType = useSelector(selectTaskListType);

    // Name of the relevant task group
    // Since hooks can't be handled conditionally (after the null check), just pass the empty string, we know the task should be here
    const taskGroupName = useSelector(
        selectTaskGroupNameByID(thisTask?.taskGroupID || "")
    );

    // Don't render the component if the task could not be found
    if (thisTask === undefined) {
        return null;
    }

    // Runs when the edit name button is clicked
    const onEditNameClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
            dispatch(
                setTaskName({
                    taskID: thisTask.id,
                    name: taskName
                })
            );
        }
    };

    // Runs when the description is changed
    const onDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(
            setTaskDescription({
                taskID: thisTask.id,
                description: event.target.value
            })
        );
    };

    // Sets if the task should be open
    const setIsOpen = (open: boolean) => {
        dispatch(
            setTaskOpen({
                taskID: thisTask.id,
                open
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
                taskID: thisTask.id,
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
                taskID: thisTask.id,
                tag: tagString
            })
        );
    };

    // Runs when the reset tags button is clicked
    const onResetTagsClicked = () => {
        if (confirm("Do you really want to reset the tags?")) {
            dispatch(
                setTaskTags({
                    taskID: thisTask.id,
                    tags: []
                })
            );
        }
    };

    return (
        <div className="task-component" data-testid={`task-component-${thisTask.id}`}>
            <div className="task-header" onClick={() => setIsOpen(!thisTask.isOpen)}>
                <div className="task-name-container">
                    <div
                        className="task-component-name-display"
                        data-testid={`task-component-name-text-${thisTask.id}`}
                    >
                        {thisTask.name}
                    </div>

                    <div
                        className="task-component-priority-top-right"
                        data-testid={`task-component-priority-top-right-${thisTask.id}`}
                    >
                        {thisTask.priority}
                    </div>
                </div>

                {taskListType === TaskListType.All && (
                    <div
                        className="task-group-name"
                        data-testid={`task-component-group-name-${thisTask.id}`}
                    >
                        {thisTask.taskGroupID === "" ? "Ungrouped" : taskGroupName}
                    </div>
                )}
            </div>

            {thisTask.isOpen ? (
                <div className="task-body" data-testid={`task-body-${thisTask.id}`}>
                    <button
                        className="task-button"
                        data-testid={`edit-name-task-button-${thisTask.id}`}
                        onClick={onEditNameClicked}
                    >
                        Edit Name
                    </button>

                    <div className="task-description-container">
                        <div className="task-description-label">Description:</div>

                        <textarea
                            className="task-description-textarea"
                            data-testid={`task-description-textarea-${thisTask.id}`}
                            aria-label="task-description"
                            rows={5}
                            cols={30}
                            onChange={onDescriptionChanged}
                            value={thisTask.description}
                        ></textarea>
                    </div>

                    <div className="task-priority-container">
                        <div
                            className="task-priority-label"
                            data-testid={`task-priority-label-${thisTask.id}`}
                        >
                            Priority: {thisTask.priority}
                        </div>

                        <div className="flex-column-center">
                            <button
                                className="task-button"
                                data-testid={`task-priority-set-button-${thisTask.id}`}
                                onClick={onSetPriorityClicked}
                            >
                                Set Priority
                            </button>
                        </div>

                        <div className="task-priority-adders">
                            {[-10, -5, -1, 1, 5, 10].map((value) => (
                                <TaskPriorityAddButton
                                    key={value}
                                    taskID={thisTask.id}
                                    amount={value}
                                />
                            ))}
                        </div>

                        <div className="flex-column-center">
                            <button
                                className="task-button"
                                data-testid={`task-priority-reset-button-${thisTask.id}`}
                                onClick={() =>
                                    dispatch(
                                        setTaskPriority({
                                            taskID: thisTask.id,
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

                        <div
                            className="task-tags-list"
                            data-testid={`task-tags-list-${thisTask.id}`}
                        >
                            {thisTask.tags.map((tag) => (
                                <TaskTagComponent
                                    key={tag}
                                    taskID={thisTask.id}
                                    tag={tag}
                                />
                            ))}
                        </div>

                        <div className="task-add-tag-button-container">
                            <button
                                className="task-button"
                                data-testid={`task-add-tag-button-${thisTask.id}`}
                                onClick={onAddTagClicked}
                            >
                                Add Tag
                            </button>

                            <button
                                className="task-button-nomargin"
                                data-testid={`task-reset-tags-button-${thisTask.id}`}
                                onClick={onResetTagsClicked}
                            >
                                Reset Tags
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="task-component-footer"
                    data-testid={`task-component-footer-${thisTask.id}`}
                    onClick={() => setIsOpen(true)}
                />
            )}
        </div>
    );
};
