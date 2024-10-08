import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "./redux/store";
import { Root } from "./routes/root";
import { parseTaskGroupsLocalStorage } from "./features/taskGroups/TaskGroup";
import { setGroups, setTasks } from "./redux/todoSlice";
import { parseTasksLocalStorage } from "./features/tasks/Task";

// Set up the react router
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />
    }
]);

// Set up the store
const store = createStore();

// Load important data from local storage
store.dispatch(setGroups(parseTaskGroupsLocalStorage()));
store.dispatch(setTasks(parseTasksLocalStorage()));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
