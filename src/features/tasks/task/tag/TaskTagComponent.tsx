import "./TaskTagComponent.css";

/**
 * This component displays the name of a tag and lets the user click on it to delete it from the task.
 */
export const TaskTagComponent = ({ taskID, tag}: {
    taskID: string;
    tag: string;
}) => {
    return <button className="task-tag-button" data-testid={`task-tag-button-${taskID}-${tag}`}>
        {tag}
    </button>
}