import { useEffect } from "react";

/**
 * This hook lets a component detect when a key was pressed and execute a function
 * @param key
 * @param listener
 */
export const useDetectKeydown = (key: string, onPress: () => void) => {
    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            // When the escape key is pressed, exit the modal
            if (event.key === key) {
                onPress();
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [key, onPress]);
};
