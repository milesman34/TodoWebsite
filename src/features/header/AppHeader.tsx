import "./AppHeader.css";
import { SaveButton } from "./components/SaveButton";

/**
 * This is the header for the app.
 */
export const AppHeader = () => {
    return (
        <div id="header">
            <div id="header-text">Todo Website</div>

            <SaveButton />
        </div>
    );
};
