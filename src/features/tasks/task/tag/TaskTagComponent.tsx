import { useState } from "react";
import "./TaskTagComponent.css";
import { useDispatch } from "react-redux";
import { removeTaskTag } from "../../../../redux/todoSlice";

/**
 * This component displays the name of a tag and lets the user click on it to delete it from the task.
 */
export const TaskTagComponent = ({ taskID, tag }: { taskID: string; tag: string }) => {
    // Is the component being hovered?
    const [hovered, setHovered] = useState(false);

    const dispatch = useDispatch();

    const onMouseEnter = () => setHovered(true);
    const onMouseLeave = () => setHovered(false);

    const onClick = () => {
        dispatch(
            removeTaskTag({
                taskID,
                tag
            })
        );
    };

    return (
        <button
            className="task-tag-button"
            data-testid={`task-tag-button-${taskID}-${tag}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {hovered ? "Delete" : tag}
        </button>
    );
};
