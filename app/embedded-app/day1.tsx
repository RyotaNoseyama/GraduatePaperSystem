"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function Day1Page() {
  const [startDate, setStartDate] = useState<number | null>(null);
  const [endDate, setEndDate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const assumedToday = 15;

  const today = useMemo(() => new Date(), []);
  const monthName = today.toLocaleString("default", { month: "long" });
  const currentYear = today.getFullYear();
  const daysInMonth = useMemo(
    () => new Date(currentYear, today.getMonth() + 1, 0).getDate(),
    [currentYear, today],
  );
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, index) => index + 1),
    [daysInMonth],
  );

  const handleDayClick = (day: number) => {
    if (startDate === null || (startDate !== null && endDate !== null)) {
      setStartDate(day);
      setEndDate(null);
      return;
    }

    if (day < startDate) {
      setEndDate(startDate);
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const handleBook = () => {
    if (startDate === null || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const hasPast =
        startDate < assumedToday ||
        (endDate !== null && endDate < assumedToday);
      if (hasPast) {
        alert("Error: You cannot select a date in the past.");
      } else {
        alert("Reservation request received. Our host will contact you soon.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold tracking-tight">
            StayComfort
          </span>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900">
              Rooms
            </a>
            <a href="#" className="hover:text-slate-900">
              Dining
            </a>
            <a href="#" className="hover:text-slate-900">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-12 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl lg:grid-cols-2">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://placehold.co/600x420/png?text=Luxury+Suite"
                alt="Luxury Suite"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                Featured Suite
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Luxury Suite
              </h1>
              <p className="mt-3 text-4xl font-semibold text-slate-900">
                $120/night
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Wake up to an uninterrupted ocean horizon, tailored concierge
                services, and an expertly curated minibar. Every detail is
                designed to make your stay effortless and indulgent.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Calendar className="h-4 w-4 text-slate-500" />
              Select Dates
            </div>
            <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <ChevronRight className="h-4 w-4" />
                  Next
                </button>
                <div className="text-center text-lg font-semibold text-slate-900">
                  {monthName} {currentYear}
                </div>
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  Previous
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Today assumed as {assumedToday}.
              </p>

              <div className="mt-6 grid grid-cols-7 gap-3">
                {days.map((day) => {
                  const isStart = startDate === day;
                  const isEnd = endDate === day && endDate !== startDate;
                  const isInRange =
                    startDate !== null &&
                    endDate !== null &&
                    day > startDate &&
                    day < endDate;
                  const isSelected = isStart || isEnd;
                  const isToday = day === assumedToday;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={`flex h-12 w-full items-center justify-center rounded-xl border text-sm font-semibold transition hover:bg-blue-50 ${
                        isStart
                          ? "border-blue-600 bg-blue-600 text-white"
                          : isEnd
                            ? "border-blue-400 bg-blue-500 text-white"
                            : isInRange
                              ? "border-blue-100 bg-blue-50 text-slate-900"
                              : "border-slate-200 bg-white text-slate-900"
                      } ${
                        isToday && !isSelected && !isInRange
                          ? "ring-2 ring-amber-500"
                          : ""
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
              <p className="text-sm text-slate-600">
                Select a date to continue. We confirm availability after your
                request is submitted, and a travel specialist follows up with
                upgrade options and experiences tailored to your stay.
              </p>
              <button
                type="button"
                onClick={handleBook}
                disabled={isLoading}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition ${
                  isLoading ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Book Now"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
