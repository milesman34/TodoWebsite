import "./root.css";
import { TaskGroupSidebar } from "../features/taskGroups/sidebar/TaskGroupSidebar";
import { TasksContainer } from "../features/tasks/container/TasksContainer";
import { AppHeader } from "../features/header/AppHeader";
import { NotificationManager } from "../features/notifications/NotificationManager";

export const Root = () => {
    return (
        <div id="app-full">
            <div id="background">
                <AppHeader />

                <div id="main-container">
                    <TaskGroupSidebar />
                    <TasksContainer />
                </div>
            </div>

            <NotificationManager />
        </div>
    );
};
