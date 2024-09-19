import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import taskGroupSlice from "../features/taskGroups/taskGroupSlice";

/**
 * Function that creates a new instance of the store
 * This is required for testing, as otherwise the same instance of the store is used across tests, which is bad
 */
export const createStore = () => configureStore({
    reducer: taskGroupSlice
});

// Redux store for this app
const store = createStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
