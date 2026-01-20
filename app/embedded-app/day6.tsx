"use client";

import { useState } from "react";
import { FileText, Image, Sheet, Search, Zap } from "lucide-react";

type FileItem = {
  id: string;
  name: string;
  type: "doc" | "img" | "sheet";
  date: string;
  size: string;
};

const INITIAL_FILES: FileItem[] = [
  {
    id: "1",
    name: "Project_Report.pdf",
    type: "doc",
    date: "Oct 12, 2025",
    size: "2.1 MB",
  },
  {
    id: "2",
    name: "Vacation_Photo.jpg",
    type: "img",
    date: "Sep 02, 2025",
    size: "6.4 MB",
  },
  {
    id: "3",
    name: "Budget_2025.xlsx",
    type: "sheet",
    date: "Aug 18, 2025",
    size: "820 KB",
  },
];

export default function Day6Page() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const renderIcon = (type: FileItem["type"]) => {
    if (type === "doc") {
      return <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />;
    }
    if (type === "img") {
      return <Image className="h-5 w-5 text-pink-500" aria-hidden="true" />;
    }
    return <Sheet className="h-5 w-5 text-emerald-500" aria-hidden="true" />;
  };

  const handleDeprovision = () => {
    if (!selectedFileId) {
      return;
    }
    const confirmed = window.confirm(
      "Status: Pending Transaction. Commit operation to generic handler?",
    );
    if (!confirmed) {
      return;
    }
    setFiles((prev) => prev.filter((file) => file.id !== selectedFileId));
    setSelectedFileId(null);
    alert("Object 0x892F purged permanently.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-100 p-2">
              <Zap className="h-5 w-5 text-blue-500" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold text-slate-800">
              SkyVault
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="flex w-full max-w-lg items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search objects and indexes"
                className="w-full bg-transparent px-3 text-sm text-slate-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <p className="font-semibold text-slate-700">Casey Lin</p>
              <p className="text-slate-400">Operations</p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
              CL
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl gap-6 px-6 py-10">
        <aside className="w-64 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-800"
            >
              <span>My Files</span>
              <span className="rounded-full bg-slate-200 px-2 text-xs">
                128
              </span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-50"
            >
              <span>Shared</span>
              <span className="rounded-full bg-slate-100 px-2 text-xs">42</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-50"
            >
              <span>Trash</span>
              <span className="rounded-full bg-slate-100 px-2 text-xs">9</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Active Objects
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Cloud Files
              </h2>
            </div>
            <button
              type="button"
              onClick={handleDeprovision}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
            >
              <Zap className="h-4 w-4" aria-hidden="true" />
              Deprovision Asset
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {files.map((file) => {
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setSelectedFileId(file.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border border-transparent px-4 py-4 text-left transition ${
                    isSelected
                      ? "bg-blue-50 ring-2 ring-blue-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="rounded-2xl bg-slate-100 p-3">
                      {renderIcon(file.type)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">Synced • AES-512</p>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-8 text-sm text-slate-500">
                    <span>{file.date}</span>
                    <span>{file.size}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
