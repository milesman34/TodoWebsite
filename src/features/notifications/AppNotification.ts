/**
 * Represents a notification to display
 */
export type AppNotification = {
    text: string;
    id: string;
};

/**
 * Creates a notification
 * @param text
 * @param id
 * @returns
 */
export const AppNotification = ({
    text,
    id
}: {
    text: string;
    id: string;
}): AppNotification => ({
    text,
    id
});
