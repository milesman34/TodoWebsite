import "./TaskComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
    selectTaskGroupNameByID,
    selectTaskListType,
    selectTaskWithID,
    setTaskOpen,
    TaskListType
} from "../../../redux/todoSlice";
import { TaskComponentOpen } from "./TaskComponentOpen";
import { useEffect } from "react";
import omit from "lodash.omit";

/**
 * Component for displaying a Task
 * This uses taskID instead of task as the parameter since otherwise it won't be updated as easily if you are testing it
 * It requires store support so that the component can actually be updated when it updates the store
 */
export const TaskComponent = ({ taskID }: { taskID: string }) => {
    const dispatch = useDispatch();

    const thisTask = useSelector(selectTaskWithID(taskID));

    const taskListType = useSelector(selectTaskListType);

    // Name of the relevant task group
    // Since hooks can't be handled conditionally (after the null check), just pass the empty string, we know the task should be here
    const taskGroupName = useSelector(
        selectTaskGroupNameByID(thisTask?.taskGroupID || "")
    );

    // Set up the localStorage effect when the task is changed
    useEffect(() => {
        if (thisTask !== undefined) {
            localStorage.setItem(
                `tasks-${thisTask.id}`,
                JSON.stringify(omit(thisTask, "isOpen"))
            );
        }
    }, [thisTask]);

    // Don't render the component if the task could not be found
    if (thisTask === undefined) {
        return null;
    }

    // Sets if the task should be open
    const setIsOpen = (open: boolean) => {
        dispatch(
            setTaskOpen({
                taskID: thisTask.id,
                open
            })
        );
    };

    return (
        <div className="task-component" data-testid={`task-component-${thisTask.id}`}>
            <div className="task-header" onClick={() => setIsOpen(!thisTask.isOpen)}>
                <div className="task-name-container">
                    <div
                        className="task-component-name-display"
                        data-testid={`task-component-name-text-${thisTask.id}`}
                    >
                        {thisTask.name}
                    </div>

                    <div
                        className="task-component-priority-top-right"
                        data-testid={`task-component-priority-top-right-${thisTask.id}`}
                    >
                        {thisTask.priority}
                    </div>
                </div>

                {taskListType === TaskListType.All && (
                    <div
                        className="task-group-name"
                        data-testid={`task-component-group-name-${thisTask.id}`}
                    >
                        {thisTask.taskGroupID === "" ? "Ungrouped" : taskGroupName}
                    </div>
                )}
            </div>

            {thisTask.isOpen ? (
                <TaskComponentOpen task={thisTask} />
            ) : (
                <div
                    className="task-component-footer"
                    data-testid={`task-component-footer-${thisTask.id}`}
                    onClick={() => setIsOpen(true)}
                />
            )}
        </div>
    );
};
