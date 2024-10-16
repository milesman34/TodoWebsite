import { useSelector } from "react-redux";
import "./NotificationManager.css";
import { selectNotifications } from "../../redux/todoSlice";

/**
 * This component manages the notifications to display
 */
export const NotificationManager = () => {
    const notifications = useSelector(selectNotifications);

    return <div id="notification-manager">Test</div>;
};
