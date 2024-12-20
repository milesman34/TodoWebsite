import { useDispatch, useSelector } from "react-redux";
import { TaskGroup } from "../TaskGroup";

import classNames from "classnames";
import {
    Modal,
    selectActiveTaskGroupID,
    setActiveModal,
    setActiveTaskGroup
} from "../../../redux/todoSlice";
import "./TaskGroupComponent.css";

/**
 * This component displays a task group and can be clicked on to activate it
 *
 * Use task-group-component-{id} to reference the main div
 * @param taskGroup
 * @returns
 */
export const TaskGroupComponent = ({ taskGroup }: { taskGroup: TaskGroup }) => {
    // Figure out if this group is active
    const activeGroupID = useSelector(selectActiveTaskGroupID);
    const isActive = taskGroup.id === activeGroupID;

    const dispatch = useDispatch();

    // Runs when this task group is clicked
    const onTaskGroupClicked = () => {
        // Turn off the filter tasks modal anyways
        dispatch(setActiveModal(Modal.None));

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
