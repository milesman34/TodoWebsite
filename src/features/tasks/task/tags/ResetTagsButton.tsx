import { useDispatch } from "react-redux";
import { setTaskTags } from "../../../../redux/todoSlice";

/**
 * This button resets the tags of a task.
 */
export const ResetTagsButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    // Runs when the reset tags button is clicked
    const onResetTagsClicked = () => {
        if (confirm("Do you really want to reset the tags?")) {
            dispatch(
                setTaskTags({
                    taskID: id,
                    tags: []
                })
            );
        }
    };

    return (
        <button
            className="task-button-nomargin"
            data-testid={`task-reset-tags-button-${id}`}
            onClick={onResetTagsClicked}
        >
            Reset Tags
        </button>
    );
};
