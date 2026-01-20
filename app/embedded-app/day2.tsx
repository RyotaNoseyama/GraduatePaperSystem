"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";

export default function Day2Page() {
  const [flag, setFlag] = useState<0 | 1>(0);
  const [isSaving, setIsSaving] = useState(false);

  const toggleFlag = () => {
    setFlag((prev) => (prev === 1 ? 0 : 1));
  };

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(
        "FATAL EXCEPTION: 0x8004AF32 - NullReference in UpdateUserConfig(). Transaction rolled back.",
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl gap-8 px-6 py-12">
        <aside className="w-60 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.45em] text-slate-400">
            Settings
          </p>
          <nav className="mt-6 text-sm font-semibold text-slate-900">
            <button className="w-full rounded-2xl border border-slate-900 bg-slate-900/5 px-4 py-2 text-left">
              Notifications
            </button>
          </nav>
        </aside>

        <section className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <header className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/5">
              <Database className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Config Node
              </p>
              <h1 className="text-2xl font-semibold">Notification Settings</h1>
            </div>
          </header>

          <div className="mt-8 space-y-6">
            <article className="rounded-2xl border border-slate-100 p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  USR_CFG_EMAIL_NOTIF_BOOL_V2
                </p>
                <p className="text-xs font-mono text-slate-500">
                  DataType: Boolean | Default: 0 | Nullable: False
                </p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  aria-pressed={flag === 1}
                  onClick={toggleFlag}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${
                    flag === 1
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-slate-300 bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                      flag === 1 ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-slate-600">
                  State: {flag}
                </span>
              </div>
            </article>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleSave}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition ${
                  isSaving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
