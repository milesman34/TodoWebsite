import { useDispatch } from "react-redux";
import { setActiveTaskGroupName } from "../../../../redux/todoSlice";

/**
 * This button edits the name of the task group
 */
export const EditNameButton = () => {
    const dispatch = useDispatch();

    // Runs when the edit name button is clicked
    const onEditNameButtonClicked = () => {
        const groupName = prompt("Enter task group name")?.trim();

        if (!(groupName === "" || groupName === undefined)) {
            dispatch(setActiveTaskGroupName(groupName));
        }
    };

    return (
        <button
            id="group-edit-name-button"
            data-testid="group-edit-name-button"
            onClick={onEditNameButtonClicked}
        >
            Edit Name
        </button>
    );
};
