import { useDispatch, useSelector } from "react-redux";
import { Task } from "../../Task";
import {
    moveTaskToGroup,
    moveTaskToUngrouped,
    selectTaskGroups
} from "../../../../redux/todoSlice";

/**
 * This button lets the user move the task to another group.
 */
export const MoveTaskButton = ({ task }: { task: Task }) => {
    const dispatch = useDispatch();

    const taskGroups = useSelector(selectTaskGroups);

    // Runs when the selector is used
    const onSelectorUsed = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Value is the ID
        const group = event.target.value;

        if (group === "Ungrouped") {
            dispatch(moveTaskToUngrouped(task.id));
        } else {
            dispatch(
                moveTaskToGroup({
                    id: task.id,
                    groupID: group
                })
            );
        }
    };

    return (
        <div className="flex-row">
            <div className="move-task-text">Move Task:</div>

            <select
                className="task-button-nomargin move-task-select"
                data-testid={`move-task-select-${task.id}`}
                name="groups"
                id="groups"
                value={task.taskGroupID}
                onChange={onSelectorUsed}
            >
                <option value="Ungrouped" data-testid={`move-task-select-option-${task.id}`}>Ungrouped</option>

                {taskGroups.map((group) => (
                    <option value={group.id} key={group.id} data-testid={`move-task-select-option-${task.id}`}>
                        {group.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
