/**
 * This component displays a notification for some amount of time. It can be clicked to make it go away.
 */
export const NotificationComponent = ({
    index, // We need the index to make sure it is unique
    text
}: {
    index: number;
    text: string;
}) => {
    return (
        <button
            className="notification-component"
            data-testid={`notification-component-${index}`}
        >
            {text}
        </button>
    );
};
