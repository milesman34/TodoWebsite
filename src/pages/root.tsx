import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppHeader } from "../features/header/AppHeader";
import { NotificationManager } from "../features/notifications/NotificationManager";
import { AppPage, selectCurrentPage } from "../redux/todoSlice";
import { saveCurrentPage } from "../utils/storageTools";
import { MainPage } from "./main/MainPage";
import { ManageSavePage } from "./manage-save/ManageSavePage";
import "./root.css";
import { ModalManager } from "../features/modals/ModalManager";

/**
 * This component represents the main container for the app.
 */
export const Root = () => {
    const currentPage = useSelector(selectCurrentPage);

    // Update the current page in sessionStorage
    useEffect(() => {
        saveCurrentPage(currentPage);
    }, [currentPage]);

    return (
        <div id="app-full">
            <div id="background">
                <AppHeader />

                {currentPage === AppPage.Main && <MainPage />}
                {currentPage === AppPage.ManageSave && <ManageSavePage />}
            </div>

            <ModalManager />
            <NotificationManager />
        </div>
    );
};
