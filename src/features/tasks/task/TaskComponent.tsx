import { Task } from "../Task";
import "./TaskComponent.css";

/**
 * Component for displaying a Task
 */
export const TaskComponent = ({ task }: { task: Task }) => {
    return (
        <div className="task-component" data-testid={`task-component-${task.id}`}>
            <div
                className="task-component-name-display"
                data-testid={`task-component-name-text-${task.id}`}
            >
                {task.name}
            </div>

            <div className="task-component-footer" />
        </div>
    );
};
