import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AdminEditEventModal from "./AdminEditEventModal";
import type { AdminEvent } from "../../types/adminEvent";

// A full year ahead of "now" so the date always falls inside the admin date
// picker's current-date..+2-years window, however far in the future this runs.
const FUTURE_YEAR = new Date().getFullYear() + 1;
const INITIAL_DATE = `${FUTURE_YEAR}-06-10`;
const EDITED_DATE = `${FUTURE_YEAR}-06-20`;

const baseEvent: AdminEvent = {
  id: 1,
  personName: "محمد أحمد",
  eventType: "WEDDING",
  eventDate: INITIAL_DATE,
  location: "قاعة الأفراح",
  contactPhone: "0591234567",
  notes: null,
  status: "PENDING",
  createdAt: "2026-01-01T00:00:00Z",
  hasDateConflict: false,
  sameDateCount: 0,
  updatedAt: "2026-01-01T00:00:00Z"
};

describe("AdminEditEventModal", () => {
  it("edits the event type and date through the custom controls, then saves the payload", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onClose = vi.fn();

    render(
      <AdminEditEventModal
        event={baseEvent}
        saving={false}
        serverErrors={{}}
        serverMessage=""
        onSave={onSave}
        onClose={onClose}
      />
    );

    // Custom event-type dropdown, not a native <select>.
    // (its accessible name comes from the associated <label>, same as a native
    // control would — the current value is checked via its visible text below.)
    const eventTypeToggle = screen.getByLabelText(/نوع المناسبة/);
    expect(eventTypeToggle).toHaveTextContent("عرس");
    await user.click(eventTypeToggle);
    await user.click(screen.getByRole("option", { name: "سهرة عروس" }));
    expect(eventTypeToggle).toHaveTextContent("سهرة عروس");

    // Custom numeric date picker, not a native <input type="date">.
    await user.click(screen.getByRole("button", { name: "10" }));
    await user.click(screen.getByRole("button", { name: "20" }));

    await user.click(screen.getByRole("button", { name: "حفظ التعديلات" }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith({
      personName: "محمد أحمد",
      eventType: "BRIDE_PARTY",
      eventDate: EDITED_DATE,
      location: "قاعة الأفراح",
      contactPhone: "0591234567",
      notes: null
    });
  });
});
