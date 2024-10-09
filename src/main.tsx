import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Root } from "./routes/root";
import { createStore } from "./redux/store";
import {
    setActiveTaskGroup,
    setGroups,
    setTaskOpen,
    setTasks,
    switchToAllTasks,
    switchToUngroupedTasks,
    TaskListType
} from "./redux/todoSlice";
import { parseTaskGroupsLocalStorage } from "./features/taskGroups/TaskGroup";
import { parseTasksLocalStorage } from "./features/tasks/Task";
import { loadOpenTaskIDs, loadTaskListTypeSession } from "./utils/utils";

// Set up the react router
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    }
]);

const store = createStore();

// Runs when the app loads, to load from localStorage
store.dispatch(setGroups(parseTaskGroupsLocalStorage()));
store.dispatch(setTasks(parseTasksLocalStorage()));

// Get the task list type from session storage
const taskListType = loadTaskListTypeSession();

if (taskListType === TaskListType.All) {
    store.dispatch(switchToAllTasks());
} else if (taskListType === TaskListType.Ungrouped) {
    store.dispatch(switchToUngroupedTasks());
} else {
    store.dispatch(setActiveTaskGroup(sessionStorage.getItem("activeTaskGroup") || ""));
}

for (const taskID of loadOpenTaskIDs()) {
    store.dispatch(
        setTaskOpen({
            taskID,
            open: true
        })
    );
}

// Get the list of open tasks by ID

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
