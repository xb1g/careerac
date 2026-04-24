import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SavedCoursesSource from "./saved-courses-source";

describe("SavedCoursesSource", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/api/user-courses/as-transcript")) {
          return {
            ok: true,
            json: async () => ({
              hasCourses: true,
              courseCount: 2,
              institution: "",
              transcriptData: {
                institution: "",
                courses: [
                  { code: "MATH 1", title: "Calculus I", units: 4, status: "completed" },
                  { code: "CS 1", title: "Intro to CS", units: 4, status: "completed" },
                ],
                totalUnitsCompleted: 8,
                totalUnitsInProgress: 0,
              },
            }),
          };
        }

        if (url.includes("/api/institutions")) {
          return {
            ok: true,
            json: async () => ({
              ccs: [
                { id: "de-anza", name: "De Anza College", abbreviation: "DA" },
                { id: "foothill", name: "Foothill College", abbreviation: "FH" },
              ],
            }),
          };
        }

        throw new Error(`Unexpected fetch: ${url}`);
      }),
    );
  });

  it("autofills the college field from suggestions before using saved courses", async () => {
    const onUseSavedCourses = vi.fn();

    render(<SavedCoursesSource onUseSavedCourses={onUseSavedCourses} />);

    await screen.findByText("Use your saved courses");

    fireEvent.change(screen.getByLabelText("Community college name"), {
      target: { value: "de an" },
    });

    fireEvent.mouseDown(await screen.findByRole("option", { name: /De Anza College/i }));

    expect(screen.getByDisplayValue("De Anza College")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Use saved courses" }));

    await waitFor(() =>
      expect(onUseSavedCourses).toHaveBeenCalledWith(
        expect.objectContaining({
          institution: "De Anza College",
        }),
      ),
    );
  });
});
