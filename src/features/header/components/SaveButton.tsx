import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import {
    pushNotification,
    selectActiveTaskGroupID,
    selectAllTasks,
    selectCurrentPage,
    selectOpenTaskIDs,
    selectTaskGroups,
    selectTaskIDs,
    selectTaskListType
} from "../../../redux/todoSlice";
import {
    saveActiveTaskGroup,
    saveCurrentPage,
    saveOpenTaskIDs,
    saveTask,
    saveTaskGroups,
    saveTaskIDs,
    saveTaskListType
} from "../../../utils/storageTools";
import { AppNotification } from "../../notifications/AppNotification";

/**
 * This button can be clicked to save the user data
 */
export const SaveButton = () => {
    const taskGroups = useSelector(selectTaskGroups);
    const taskListType = useSelector(selectTaskListType);
    const activeTaskGroup = useSelector(selectActiveTaskGroupID);
    const taskIDs = useSelector(selectTaskIDs);
    const openTaskIDs = useSelector(selectOpenTaskIDs);
    const tasks = useSelector(selectAllTasks);
    const currentPage = useSelector(selectCurrentPage);

    const dispatch = useDispatch();

    const onSaveClicked = () => {
        // Save all necessary info to localStorage and sessionStorage
        saveTaskGroups(taskGroups);
        saveTaskListType(taskListType);
        saveActiveTaskGroup(activeTaskGroup);

        // Save task information
        saveTaskIDs(taskIDs);
        saveOpenTaskIDs(openTaskIDs);

        for (const task of tasks) {
            saveTask(task);
        }

        // Save the current page
        saveCurrentPage(currentPage);

        dispatch(
            pushNotification(
                AppNotification({
                    text: "Saved",
                    id: nanoid()
                })
            )
        );
    };

    return (
        <button
            className="header-button"
            data-testid="save-button"
            onClick={onSaveClicked}
        >
            Save Data
        </button>
    );
};
