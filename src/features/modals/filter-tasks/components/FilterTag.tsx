import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { removeFilterTag } from "../../../../redux/todoSlice";

// Default width
const DEFAULT_WIDTH = 65;

/**
 * This component displays the name of a tag and lets the user click on it to delete it from the filter tags.
 * This is basically a copy of the original TaskTagComponent, but it seemed easier with only needing 2 variations compared to a superclass.
 */
export const FilterTag = ({ tag }: { tag: string }) => {
    // Is the component being hovered?
    const [hovered, setHovered] = useState(false);

    // This component was difficult to implement, due to needing to preserve width/height on hover
    // The best way I found was to use a ref, and whenever the element is hovered, it sets the effective width/height, thus setting the component to have that height
    // Is this the initial render?
    const [initialRender, setInitialRender] = useState(true);

    const dispatch = useDispatch();

    // Ref to use for finding the dimensions
    const ref = useRef<HTMLButtonElement>(null);

    const onMouseEnter = () => setHovered(true);
    const onMouseLeave = () => setHovered(false);

    // Set up the dimensions in practice based on the starting width (hacky solution)
    const [width, setWidth] = useState(DEFAULT_WIDTH);

    // When it is clicked, remove the tag from the task
    const onClick = () => {
        dispatch(removeFilterTag(tag));
    };

    // This effect is used to maintain the size on hover
    useEffect(() => {
        setWidth(ref.current!.offsetWidth);

        // This is no longer the initial render, so now the button can use the measured width/height
        setInitialRender(false);
    }, [hovered, width]);

    return (
        <button
            className="task-tag-button"
            data-testid={`filter-tag-button-${tag}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            ref={ref}
            style={
                initialRender
                    ? {}
                    : {
                          minWidth: width,
                          maxWidth: width
                      }
            }
        >
            {hovered ? "Delete" : tag}
        </button>
    );
};
