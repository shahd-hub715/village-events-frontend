import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EventTypeDropdown from "./EventTypeDropdown";
import type { EventType } from "../types/event";

function Harness({ onChange }: { onChange: (value: EventType) => void }) {
  const [value, setValue] = useState<"" | EventType>("");
  const [open, setOpen] = useState(false);

  return (
    <EventTypeDropdown
      id="eventType"
      value={value}
      placeholder="اختر نوع المناسبة"
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      open={open}
      onOpenChange={setOpen}
    />
  );
}

describe("EventTypeDropdown", () => {
  it("selects a value, reports it, and closes the menu", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Harness onChange={onChange} />);

    const toggle = screen.getByRole("button", { name: "اختر نوع المناسبة" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "سهرة عروس" }));

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("BRIDE_PARTY");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "سهرة عروس" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
