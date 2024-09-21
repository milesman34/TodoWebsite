import "./root.css";
import { TaskGroupSidebar } from "../features/taskGroups/sidebar/TaskGroupSidebar";
import { TasksContainer } from "../features/tasks/container/TasksContainer";

export const Root = () => {
    return (
        <div id="background">
            <div id="header">
                <div id="header-text">Todo Website</div>
            </div>

            <div id="main-container">
                <TaskGroupSidebar />
                <TasksContainer />
            </div>
        </div>
    );
};
