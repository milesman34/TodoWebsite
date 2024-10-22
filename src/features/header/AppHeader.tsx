import { AppPage } from "../../redux/todoSlice";
import "./AppHeader.css";
import { PageButton } from "./components/PageButton";
import { SaveButton } from "./components/SaveButton";

/**
 * This is the header for the app.
 */
export const AppHeader = () => {
    return (
        <div id="header">
            <div id="header-text">Todo Website</div>

            <div className="flex-row">
                <PageButton text="Manage Save" page={AppPage.ManageSave} />
                <SaveButton />
            </div>
        </div>
    );
};
