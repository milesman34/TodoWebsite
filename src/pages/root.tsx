import { useSelector } from "react-redux";
import { AppHeader } from "../features/header/AppHeader";
import { NotificationManager } from "../features/notifications/NotificationManager";
import { MainPage } from "./main/MainPage";
import "./root.css";
import { AppPage, selectCurrentPage } from "../redux/todoSlice";

/**
 * This component represents the main container for the app.
 */
export const Root = () => {
    const currentPage = useSelector(selectCurrentPage);

    return (
        <div id="app-full">
            <div id="background">
                <AppHeader />

                {currentPage === AppPage.Main && <MainPage />}
            </div>

            <NotificationManager />
        </div>
    );
};
