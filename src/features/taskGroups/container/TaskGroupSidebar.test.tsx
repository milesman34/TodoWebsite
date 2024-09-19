import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskGroupSidebar } from "./TaskGroupSidebar";

import { describe, Mock, test, vi } from "vitest";
import { nanoid } from "nanoid";

vi.mock("nanoid", () => ({
    nanoid: vi.fn()
}));

describe("TaskGroupSidebar", () => {
    test("Add Task Group button adds a new Task Group (with no task groups added yet)", async () => {
        (nanoid as Mock).mockImplementation(() => "5e9");

        // render(<TaskGroupSidebar />);

        // await userEvent.click(screen.getByTestId("add-task-group-button"));
    });
});
