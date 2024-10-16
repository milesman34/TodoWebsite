import { Task } from "../../Task";
import { AddTagButton } from "./AddTagButton";
import { ResetTagsButton } from "./ResetTagsButton";
import { TaskTagComponent } from "./tag/TaskTagComponent";

/**
 * This component displays the task's tags and lets the user manipulate them.
 */
export const TaskTags = ({ task }: { task: Task }) => {
    return (
        <div className="task-tags-container">
            <div className="task-tags-label">Tags:</div>

            <div className="task-tags-list" data-testid={`task-tags-list-${task.id}`}>
                {task.tags.map((tag) => (
                    <TaskTagComponent key={tag} taskID={task.id} tag={tag} />
                ))}
            </div>

            <div className="task-add-tag-button-container">
                <AddTagButton id={task.id} />

                <ResetTagsButton id={task.id} />
            </div>
        </div>
    );
};
