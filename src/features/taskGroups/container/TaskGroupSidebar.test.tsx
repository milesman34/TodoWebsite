import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskGroupSidebar } from "./TaskGroupSidebar";
import * as nanoidModule from "nanoid";

jest.mock("nanoid");

describe("TaskGroupSidebar", () => {
    test("Add Task Group button adds a new Task Group (with no task groups added yet)", async () => {
        jest.spyOn(nanoidModule, "nanoid").mockImplementation(() => "0");

        render(<TaskGroupSidebar />);

        await userEvent.click(screen.getByTestId("add-task-group-button"));
    });
});
