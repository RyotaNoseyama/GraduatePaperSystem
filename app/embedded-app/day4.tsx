"use client";

import { useState, type ChangeEvent } from "react";
import { Shield, User } from "lucide-react";

export default function Day4Page() {
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [agree, setAgree] = useState(true);

  const handleRegister = () => {
    alert("Registered Successfully!");
  };

  const handleCancel = () => {
    setNickname("");
    setUserId("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-slate-900">
          <Shield className="h-6 w-6 text-blue-600" aria-hidden="true" />
          <span className="text-lg font-semibold">PortalX</span>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          Help
        </a>
      </nav>

      <div className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3">
              <User className="h-6 w-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Onboard
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Create your account
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            <FieldBlock
              value={nickname}
              placeholder="Type your nickname here"
              label="Nickname"
              onChange={(event) => setNickname(event.target.value)}
            />
            <FieldBlock
              value={userId}
              placeholder="Type your user ID"
              label="User ID"
              onChange={(event) => setUserId(event.target.value)}
            />

            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) => setAgree(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-300"
              />
              <span>I agree to the Terms of Service</span>
            </label>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleRegister}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 px-8 py-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-200"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Cancel
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a href="#" className="font-semibold text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

type FieldBlockProps = {
  value: string;
  placeholder: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function FieldBlock({ value, placeholder, label, onChange }: FieldBlockProps) {
  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-base text-slate-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      <span className="mt-1 text-xs font-medium text-slate-500">{label}</span>
    </div>
  );
}
