import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import taskGroupSlice from "../features/taskGroups/taskGroupSlice";

// Redux store for this app
const store = configureStore({
    reducer: taskGroupSlice
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
