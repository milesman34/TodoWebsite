import { useDispatch } from "react-redux";
import { setActiveTaskGroupDescription } from "../../../../redux/todoSlice";
import { TaskGroup } from "../../../taskGroups/TaskGroup";

/**
 * This component displays the task group description
 */
export const TaskGroupDescription = ({ taskGroup}: {
    taskGroup: TaskGroup; // Current task group
}) => {
    const dispatch = useDispatch();

    // Runs when the group description is changed
    const onGroupDescriptionChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setActiveTaskGroupDescription(event.target.value));
    };

    return (
        <div id="group-description-container" data-testid="group-description-container">
            <div id="group-description-label">Description:</div>

            <textarea
                id="group-description-textarea"
                data-testid="group-description-textarea"
                aria-label="group-description"
                rows={3}
                cols={50}
                onChange={onGroupDescriptionChanged}
                value={taskGroup.description}
            ></textarea>
        </div>
    );
};
