import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NumericDatePicker from "./NumericDatePicker";

describe("NumericDatePicker", () => {
  it("emits the correct ISO date once day, month, and year are all picked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <NumericDatePicker
        id="eventDate"
        value=""
        min="2020-01-01"
        max="2030-12-31"
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "اليوم" }));
    await user.click(screen.getByRole("button", { name: "15" }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "الشهر" }));
    await user.click(screen.getByRole("button", { name: "07" }));
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "السنة" }));
    await user.click(screen.getByRole("button", { name: "2026" }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("2026-07-15");
  });
});
