import { TaskGroupSidebar } from "../../features/taskGroups/sidebar/TaskGroupSidebar";
import { TasksContainer } from "../../features/tasks/container/TasksContainer";

/**
 * This component represents the app's main page, containing the tasks + task groups
 */
export const MainPage = () => {
    return (
        <div id="main-container" data-testid="main-page">
            <TaskGroupSidebar />
            <TasksContainer />
        </div>
    );
};
