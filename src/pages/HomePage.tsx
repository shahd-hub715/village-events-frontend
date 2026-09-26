import { useMemo, useState } from "react";
import AddEventForm from "../components/AddEventForm";
import ChangeRequestForm from "../components/ChangeRequestForm";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import EventList from "../components/EventList";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import LoadingState from "../components/LoadingState";
import Modal from "../components/Modal";
import MonthFilter from "../components/MonthFilter";
import SearchField from "../components/SearchField";
import SuccessModal from "../components/SuccessModal";
import YearFilter from "../components/YearFilter";
import { strings } from "../config/strings";
import { villageTitle } from "../config/village";
import { getDefaultYear, getSelectableYears } from "../config/years";
import type { SubmissionResult } from "../types/ui";
import { monthNameFromKey, yearOf } from "../utils/date";
import {
  countLabel,
  filterByMonth,
  filterBySearch,
  monthKeysOf
} from "../utils/events";
import { useEvents } from "../hooks/useEvents";

export default function HomePage() {
  const [selectedYear, setSelectedYear] = useState(getDefaultYear);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [changeRequestOpen, setChangeRequestOpen] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const { events, status, reload } = useEvents(selectedYear);

  const years = useMemo(
    () => getSelectableYears(events.map((event) => yearOf(event.eventDate))),
    [events]
  );

  const monthKeys = useMemo(() => monthKeysOf(events), [events]);

  const visibleEvents = useMemo(
    () => filterBySearch(filterByMonth(events, selectedMonth), search),
    [events, selectedMonth, search]
  );

  const takenDates = useMemo(
    () => events.map((event) => event.eventDate),
    [events]
  );

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSearch("");
  };

  const openForm = () => {
    setResult(null);
    setFormOpen(true);
  };

  const emptyTitle = search.trim()
    ? strings.empty.titleSearch(search.trim())
    : selectedMonth
      ? strings.empty.titleMonth(
          `${monthNameFromKey(selectedMonth)} ${selectedYear}`
        )
      : strings.empty.titleYear(selectedYear);

  const summary =
    status === "loading"
      ? strings.events.loadingCount
      : status === "error"
        ? strings.events.unavailableCount
        : countLabel(visibleEvents.length);

  return (
    <div className="app">
      <Header onAddEvent={openForm} />

      <main className="main">
        <HeroSection
          onAddEvent={openForm}
          onRequestChange={() => setChangeRequestOpen(true)}
        />

        <section
          className="events-section"
          id="events"
          aria-labelledby="events-heading"
        >
          <div className="section-head">
            <h2 className="section-title" id="events-heading">
              {strings.events.heading}
            </h2>

            <span className="section-count">
              {summary}
            </span>
          </div>

          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onSelect={selectYear}
          />

          {status === "success" && events.length > 0 ? (
            <SearchField
              value={search}
              onChange={setSearch}
            />
          ) : null}

          {status === "success" ? (
            <MonthFilter
              monthKeys={monthKeys}
              selectedMonth={selectedMonth}
              onSelect={setSelectedMonth}
            />
          ) : null}

          {status === "loading" ? (
            <LoadingState />
          ) : null}

          {status === "error" ? (
            <ErrorMessage onRetry={reload} />
          ) : null}

          {status === "success" && visibleEvents.length === 0 ? (
            <EmptyState
              title={emptyTitle}
              text={
                search.trim()
                  ? strings.empty.searchText
                  : undefined
              }
              onAddEvent={openForm}
            />
          ) : null}

          {status === "success" && visibleEvents.length > 0 ? (
            <EventList events={visibleEvents} />
          ) : null}
        </section>
      </main>

      <footer className="site-footer">
        {strings.footer.note} · {villageTitle()}
      </footer>

      {result ? (
        <SuccessModal
          message={
            result.hasConflict
              ? result.message
              : undefined
          }
          onClose={() => setResult(null)}
        />
      ) : null}

      {formOpen ? (
        <Modal
          titleId="add-event-title"
          onClose={() => setFormOpen(false)}
        >
          <AddEventForm
            takenDates={takenDates}
            onClose={() => setFormOpen(false)}
            onSubmitted={(submission) => {
              setFormOpen(false);
              setResult(submission);
              reload();
            }}
          />
        </Modal>
      ) : null}

      {changeRequestOpen ? (
        <Modal
          titleId="change-request-title"
          variant="dialog"
          onClose={() => setChangeRequestOpen(false)}
        >
          <ChangeRequestForm
            onClose={() => setChangeRequestOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}