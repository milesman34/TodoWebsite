import { Task } from "../Task";
/**
 * Component for displaying a Task
 */
export const TaskComponent = ({ task }: { task: Task }) => {
    return <div>{task.name}</div>;
};
