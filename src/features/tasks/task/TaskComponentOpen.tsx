import { Task } from "../Task";
import { EditNameButton } from "./components/EditNameButton";
import { DeleteTaskButton } from "./components/DeleteTaskButton";
import { TaskDescription } from "./components/TaskDescription";
import { TaskPriority } from "./priority/TaskPriority";
import { TaskTags } from "./tags/TaskTags";

/**
 * This contains the part of the TaskComponent that displays when the task is open
 */
export const TaskComponentOpen = ({ task }: { task: Task }) => {
    return (
        <div className="task-body" data-testid={`task-body-${task.id}`}>
            <EditNameButton id={task.id} />

            <DeleteTaskButton id={task.id} />

            <TaskDescription task={task} />

            <TaskPriority task={task} />

            <TaskTags task={task} />
        </div>
    );
};
