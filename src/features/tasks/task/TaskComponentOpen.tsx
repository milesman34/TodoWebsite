import { Task } from "../Task";
import { DeleteTaskButton } from "./components/DeleteTaskButton";
import { EditNameButton } from "./components/EditNameButton";
import { MoveTaskButton } from "./components/MoveTaskButton";
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

            <MoveTaskButton task={task} />

            <DeleteTaskButton id={task.id} />

            <TaskDescription task={task} />

            <TaskPriority task={task} />

            <TaskTags task={task} />
        </div>
    );
};
