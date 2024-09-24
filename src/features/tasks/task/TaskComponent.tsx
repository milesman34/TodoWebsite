import "./TaskComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
    selectTaskWithID,
    setTaskDescription,
    setTaskName,
    setTaskOpen
} from "../../../redux/todoSlice";

/**
 * Component for displaying a Task
 * This uses taskID instead of task as the parameter since otherwise it won't be updated as easily if you are testing it
 * It requires store support so that the component can actually be updated when it updates the store
 */
export const TaskComponent = ({ taskID }: { taskID: string }) => {
    const dispatch = useDispatch();

    const thisTask = useSelector(selectTaskWithID(taskID));

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

    return (
        <div className="task-component" data-testid={`task-component-${thisTask.id}`}>
            <div
                className="task-component-name-display"
                data-testid={`task-component-name-text-${thisTask.id}`}
                onClick={() => setIsOpen(!thisTask.isOpen)}
            >
                {thisTask.name}
            </div>

            {thisTask.isOpen ? (
                <div className="task-body" data-testid={`task-body-${thisTask.id}`}>
                    <button
                        className="edit-name-task-button"
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
                            rows={3}
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
