import { useDispatch } from "react-redux";
import { addTaskTag } from "../../../../redux/todoSlice";

/**
 * This buttons adds a new tag to a task.
 */
export const AddTagButton = ({ id }: { id: string }) => {
    const dispatch = useDispatch();

    // Runs when the add tag button is clicked
    const onAddTagClicked = () => {
        const tagString = prompt("Enter tag name")?.trim();

        if (tagString === "" || tagString === undefined) {
            return;
        }

        dispatch(
            addTaskTag({
                taskID: id,
                tag: tagString
            })
        );
    };

    return (
        <button
            className="task-button"
            data-testid={`task-add-tag-button-${id}`}
            onClick={onAddTagClicked}
        >
            Add Tag
        </button>
    );
};
