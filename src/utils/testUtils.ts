import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";

/**
 * Mocks the return value of nanoid (nanoid must be mocked earlier)
 * @param nanoid
 * @param returnValue
 */
export const mockNanoid = (nanoid: (size?: number) => string, returnValue: string) => {
    (nanoid as Mock).mockImplementation(() => returnValue);
};

/**
 * Mocks the return value of prompt
 * @param returnValue
 * @returns
 */
export const mockPrompt = (returnValue: string | null) => {
    vi.stubGlobal("prompt", () => returnValue);
};

/**
 * Mocks the return value of confirm
 * @param returnValue
 * @returns
 */
export const mockConfirm = (returnValue: boolean) => {
    vi.stubGlobal("confirm", () => returnValue);
};

/**
 * Clicks the button with the given test ID
 * @param testID
 * @returns
 */
export const clickButton = async (testID: string) =>
    userEvent.click(screen.getByTestId(testID));

/**
 * Enters text into the text area with the given test ID
 * @param testID
 * @param text
 * @returns
 */
export const enterText = async (testID: string, text: string) =>
    userEvent.type(screen.getByTestId(testID), text);

/**
 * Gets the text content of the element with the given test ID, or null if the element does not exist
 * @param testID
 * @returns
 */
export const getTextContent = (testID: string): string | null =>
    screen.getByTestId(testID).textContent;

/**
 * Gets the number of children within the given test ID.
 * @param testID
 * @returns
 */
export const countElementChildren = (testID: string): number => {
    const children = screen.getByTestId(testID).children;

    return children.length;
};

/**
 * Returns if the element contains a certain CSS class
 * @param testID
 * @param className
 * @returns
 */
export const containsClass = (testID: string, className: string): boolean => {
    const classList = screen.getByTestId(testID)?.classList;

    return classList.contains(className);
};

/**
 * Returns the test ID from an element
 * @param element An HTML element, usually gotten from the children collection
 * @returns
 */
export const getTestID = (element: Element): string | undefined =>
    element.attributes.getNamedItem("data-testid")?.value;

/**
 * This type represents a result mock for localStorage/sessionStorage
 */
export type StorageMock = {
    setItem: Mock;
    removeItem: Mock;
};

/**
 * This type represents a storage cache
 */
type StorageCache = {
    [key: string]: string;
};

/**
 * Mocks a storage instance, returning a mock function for tracking setItem and removeItem calls
 */
const mockStorageFull = (cache: StorageCache, name: string): StorageMock => {
    const mockFn = vi.fn();
    const mockFn2 = vi.fn();

    vi.stubGlobal(name, {
        getItem: (key: string): string | null => (key in cache ? cache[key] : null),
        setItem: mockFn,
        removeItem: mockFn2,
        clear: () => {}
    });

    return {
        setItem: mockFn,
        removeItem: mockFn2
    };
};

/**
 * Mocks a local storage instance, returning the full mock storage object
 */
export const mockLocalStorageFull = (cache: StorageCache): StorageMock =>
    mockStorageFull(cache, "localStorage");

/**
 * Mocks a session storage instance, returning the full mock storage object
 */
export const mockSessionStorageFull = (cache: StorageCache): StorageMock =>
    mockStorageFull(cache, "sessionStorage");

/**
 * Mocks a local storage instance, returning only the setItem mock
 */
export const mockLocalStorage = (cache: StorageCache): Mock =>
    mockLocalStorageFull(cache).setItem;

/**
 * Mocks a session storage instance, returning only the setItem mock
 */
export const mockSessionStorage = (cache: StorageCache): Mock =>
    mockSessionStorageFull(cache).setItem;

/**
 * Mocks writing to the clipboard, returning a mock function for writeText
 */
export const mockClipboardWrite = (): Mock => {
    const mock = vi.fn();

    vi.stubGlobal("navigator", {
        clipboard: {
            writeText: mock
        }
    });

    return mock;
};

/**
 * Converts JSON into a format that userEvent.type can handle
 */
export const makeJSONTypable = (json: string): string =>
    json.replaceAll("[", "[[").replaceAll("{", "{{");
