import { useSelector } from "react-redux";
import {
    selectActiveTaskGroupID,
    selectAllTasks,
    selectOpenTaskIDs,
    selectTaskGroups,
    selectTaskIDs,
    selectTaskListType
} from "../../../redux/todoSlice";
import {
    saveActiveTaskGroup,
    saveOpenTaskIDs,
    saveTask,
    saveTaskGroups,
    saveTaskIDs,
    saveTaskListType
} from "../../../utils/storageTools";

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
    };

    return (
        <button
            className="header-button save-button"
            data-testid="save-button"
            onClick={onSaveClicked}
        >
            Save Button
        </button>
    );
};
