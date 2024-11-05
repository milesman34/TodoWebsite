import { useDispatch, useSelector } from "react-redux";
import {
    selectTaskIDs,
    setActiveTaskGroup,
    setTaskGroups,
    setTasks,
    switchToAllTasks
} from "../../../redux/todoSlice";
import { resetSaveData } from "../../../utils/storageTools";

/**
 * This button resets the save data.
 */
export const ResetSaveButton = () => {
    const dispatch = useDispatch();

    const taskIDs = useSelector(selectTaskIDs);

    const onResetSaveClicked = () => {
        if (confirm("Do you really want to reset your save data?")) {
            resetSaveData(taskIDs);

            dispatch(setTasks([]));
            dispatch(setTaskGroups([]));
            dispatch(setActiveTaskGroup(""));
            dispatch(switchToAllTasks());
        }
    };

    return (
        <button
            className="header-button reset-save-button"
            data-testid="reset-save-button"
            onClick={onResetSaveClicked}
        >
            Reset Save
        </button>
    );
};
