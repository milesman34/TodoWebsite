import { useState } from "react";
import { Task } from "../Task";
import "./TaskComponent.css";

/**
 * Component for displaying a Task
 */
export const TaskComponent = ({ task }: { task: Task }) => {
    // Is this task open?
    const [isOpen, setIsOpen] = useState(false);

    // Runs when the edit title button is clicked
    const onEditTitleClicked = () => {
        const title = prompt("Enter task title")?.trim();

        if (!(title === "" || title === undefined)) {
            // Do something
        }
    }

    return (
        <div className="task-component" data-testid={`task-component-${task.id}`}>
            <div
                className="task-component-name-display"
                data-testid={`task-component-name-text-${task.id}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {task.name}
            </div>

            {isOpen ? (
                <div className="task-body" data-testid={`task-body-${task.id}`}>
                    <button
                        className="edit-title-task-button"
                        data-testid={`edit-title-task-button-${task.id}`}
                        onClick={onEditTitleClicked}
                    >
                        Edit Title
                    </button>
                </div>
            ) : (
                <div
                    className="task-component-footer"
                    data-testid={`task-component-footer-${task.id}`}
                    onClick={() => setIsOpen(true)}
                />
            )}
        </div>
    );
};
