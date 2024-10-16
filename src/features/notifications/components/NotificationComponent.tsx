import classNames from "classnames";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeNotificationByID } from "../../../redux/todoSlice";
import { AppNotification } from "../AppNotification";

// Timeout for the fade animation starting
const ANIMATION_DELAY = 2500;

/**
 * This component displays a notification for some amount of time. It can be clicked to make it go away.
 */
export const NotificationComponent = ({
    notification
}: {
    notification: AppNotification;
}) => {
    // Has the notification expired?
    const [expired, setExpired] = useState(false);

    // Is the fade animation starting?
    const [fadeAnimationStarted, setFadeAnimationStarted] = useState(false);

    const dispatch = useDispatch();

    // Set up timeout for starting the fade animation
    useEffect(() => {
        const timeout = setTimeout(() => setFadeAnimationStarted(true), ANIMATION_DELAY);

        return () => clearTimeout(timeout);
    }, [expired]);

    // 1 second timeout for actually deleting the component after the fade animation starts
    useEffect(() => {
        if (fadeAnimationStarted) {
            const timeout = setTimeout(() => setExpired(true), 1000);

            return () => clearTimeout(timeout);
        }
    }, [fadeAnimationStarted]);

    // Runs when the notification is clicked
    const onNotificationClicked = () => {
        dispatch(removeNotificationByID(notification.id));
    };

    if (expired) {
        onNotificationClicked();
    }

    return (
        <button
            className={classNames(
                "notification-component",
                fadeAnimationStarted ? "notification-fade" : ""
            )}
            data-testid={`notification-component-${notification.id}`}
            onClick={onNotificationClicked}
        >
            {notification.text}
        </button>
    );
};
