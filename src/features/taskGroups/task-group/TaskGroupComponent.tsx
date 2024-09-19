import { useDispatch, useSelector } from "react-redux";
import { TaskGroup } from "../TaskGroup";

import "./TaskGroupComponent.css";
import { selectActiveTaskGroup, setActiveTaskGroup } from "../taskGroupSlice";
import classNames from "classnames";

/**
 * This component displays a task group and can be clicked on to activate it
 * @param taskGroup
 * @returns
 */
export const TaskGroupComponent = ({ taskGroup }: { taskGroup: TaskGroup }) => {
    // Figure out if this group is active
    const activeGroup = useSelector(selectActiveTaskGroup);
    const isActive = taskGroup.id === activeGroup;

    const dispatch = useDispatch();

    // Runs when this task group is clicked
    const onTaskGroupClicked = () => {
        // If this task group is already active, then deselect it
        dispatch(setActiveTaskGroup(isActive ? "" : taskGroup.id));
    };

    return (
        <div
            data-testid={`task-group-component-${taskGroup.id}`}
            className={classNames(
                "task-group-component",
                isActive ? "task-group-component-active" : ""
            )}
            onClick={onTaskGroupClicked}
        >
            {taskGroup.name}
        </div>
    );
};
