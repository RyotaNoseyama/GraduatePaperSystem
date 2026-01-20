"use client";

import { useState } from "react";
import { Crown, ShieldCheck, UserCircle2 } from "lucide-react";

export default function Day5Page() {
  const [showError, setShowError] = useState(false);

  const handleStay = () => {
    alert("Great choice! You remain a member.");
  };

  const handleCancel = () => {
    const confirmed = window.confirm("Are you sure?");
    if (!confirmed) {
      return;
    }
    setShowError(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="h-6 w-6 text-emerald-500"
            aria-hidden="true"
          />
          <p className="text-lg font-semibold">StreamPlus</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">Hello, Jordan</p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
            <UserCircle2
              className="h-7 w-7 text-slate-500"
              aria-hidden="true"
            />
          </span>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 pb-16">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute right-6 top-6 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 opacity-50 line-through transition hover:opacity-60 focus:outline-none cursor-not-allowed"
          >
            Cancel Subscription
          </button>

          <div className="flex items-center gap-4">
            <span className="rounded-full bg-amber-50 p-4">
              <Crown className="h-10 w-10 text-amber-500" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                Membership Status
              </p>
              <h1 className="text-3xl font-semibold">Premium 4K Plan</h1>
              <p className="text-sm font-medium text-amber-600">Active</p>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 p-4">
              <dt className="text-slate-500">Next Billing Date</dt>
              <dd className="text-lg font-semibold text-slate-900">
                October 25, 2025
              </dd>
            </div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <dt className="text-slate-500">Devices Linked</dt>
              <dd className="text-lg font-semibold text-slate-900">
                7 devices
              </dd>
            </div>
          </dl>

          {showError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              System.InvalidOperationException: CancellationFlow is currently
              locked. Error Code: 0xDEADDEAD.
            </div>
          )}

          <p className="mt-6 text-sm text-slate-500">
            Your benefits include Dolby Atmos, offline downloads, concierge
            support, and platinum priority routing.
          </p>

          <button
            type="button"
            onClick={handleStay}
            className="mt-10 w-full rounded-2xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 animate-bounce"
          >
            Keep My Benefits & Stay Premium
          </button>
        </div>
      </main>
    </div>
  );
}
