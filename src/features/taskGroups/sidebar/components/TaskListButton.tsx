import classNames from "classnames";
import { selectTaskListType, TaskListType } from "../../../../redux/todoSlice";
import { useSelector } from "react-redux";

import "../TaskGroupSidebar.css";

/**
 * This component lets the user go to the given task list (All Tasks or Ungrouped Tasks)
 */
export const TaskListButton = ({
    // HTML ID of the button
    id,

    // Task List Type this button uses
    taskType,

    // onClick function, should switch to the given task group
    onClick,

    // Text to display
    text
}: {
    id: string;
    taskType: TaskListType;
    onClick: () => void;
    text: string;
}) => {
    const taskListType = useSelector(selectTaskListType);

    return (
        <button
            id={id}
            data-testid={id}
            className={classNames(
                "tasks-button",
                taskListType === taskType ? "tasks-button-active" : ""
            )}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
