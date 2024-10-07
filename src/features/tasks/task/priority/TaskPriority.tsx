import { Task } from "../../Task";
import { TaskPriorityAddButton } from "./priority-add/TaskPriorityAddButton";
import { SetPriorityButton } from "./SetPriorityButton";
import { ResetPriorityButton } from "./ResetPriorityButton";

/**
 * This component displays the priority of the task and allows the user to edit it.
 */
export const TaskPriority = ({ task }: { task: Task }) => {
    return (
        <div className="task-priority-container">
            <div
                className="task-priority-label"
                data-testid={`task-priority-label-${task.id}`}
            >
                Priority: {task.priority}
            </div>

            <div className="flex-column-center">
                <SetPriorityButton id={task.id} />
            </div>

            <div className="task-priority-adders">
                {[-10, -5, -1, 1, 5, 10].map((value) => (
                    <TaskPriorityAddButton key={value} taskID={task.id} amount={value} />
                ))}
            </div>

            <div className="flex-column-center">
                <ResetPriorityButton id={task.id} />
            </div>
        </div>
    );
};
