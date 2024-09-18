import "./root.css";
import { TaskGroupSidebar } from "../features/taskGroups/container/TaskGroupSidebar";

export const Root = () => {
    return (
        <div id="background">
            <div id="header">
                <div id="header-text">Todo Website</div>
            </div>

            <TaskGroupSidebar />
        </div>
    );
};
