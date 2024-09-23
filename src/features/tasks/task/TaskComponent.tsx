import { useState } from "react";
import { Task } from "../Task";
import "./TaskComponent.css";

/**
 * Component for displaying a Task
 */
export const TaskComponent = ({ task }: { task: Task }) => {
    // Is this task open?
    const [isOpen, setIsOpen] = useState(false);

    // Runs when the edit name button is clicked
    const onEditNameClicked = () => {
        const taskName = prompt("Enter task name")?.trim();

        if (!(taskName === "" || taskName === undefined)) {
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
                        className="edit-name-task-button"
                        data-testid={`edit-name-task-button-${task.id}`}
                        onClick={onEditNameClicked}
                    >
                        Edit Name
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
