import { useSelector } from "react-redux";
import { selectNotifications } from "../../redux/todoSlice";
import { NotificationComponent } from "./components/NotificationComponent";
import "./NotificationManager.css";

/**
 * This component manages the notifications to display
 */
export const NotificationManager = () => {
    const notifications = useSelector(selectNotifications);

    return (
        <div id="notification-manager" data-testid="notification-manager">
            {notifications.length > 0 && (
                <div id="notifications-container" data-testid="notifications-container">
                    {notifications.map(
                        // To avoid a cutoff, only display the first 10 components
                        (notif, idx) =>
                            idx < 10 && <NotificationComponent key={notif.id} notification={notif} />
                    )}
                </div>
            )}
        </div>
    );
};
