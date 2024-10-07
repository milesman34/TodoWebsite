import { useDispatch } from "react-redux";
import { Task } from "../../Task";
import { setTaskDescription } from "../../../../redux/todoSlice";

/**
 * This component displays the description of the task and allows for editing.
 */
export const TaskDescription = ({ task }: { task: Task }) => {
    const dispatch = useDispatch();

    // Runs when the description is changed
    const onDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(
            setTaskDescription({
                taskID: task.id,
                description: event.target.value
            })
        );
    };

    return (
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
    );
};
