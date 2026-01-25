"use client";

import { type MouseEvent, useState } from "react";
import { ShoppingCart, Star, X } from "lucide-react";

const disabledNavLinks = ["Home", "Products", "About"];

export default function Day0Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    alert("Done");
  };

  const handleDisabledNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubscribeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-xl font-semibold tracking-tight">ShopOne</div>
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-600">
            {disabledNavLinks.map((label) => (
              <a
                key={label}
                href="#"
                aria-disabled="true"
                onClick={handleDisabledNavClick}
                className="text-slate-500 transition hover:text-slate-700 hover:cursor-not-allowed"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Home</span>
            <span className="text-slate-400">/</span>
            <span>Electronics</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">Wireless Headphones</span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <img
                src="https://placehold.co/600x600/png?text=Wireless+Headphones"
                alt="Ultra-Noise Canceling Headphones X1"
                className="h-[420px] w-full rounded-xl object-cover shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  New Arrival
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Ultra-Noise Canceling Headphones X1
                </h1>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  $299.00
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span>(120 reviews)</span>
              </div>

              <p className="text-base leading-7 text-slate-600">
                Immerse yourself in studio-grade audio with adaptive noise
                cancellation, plush memory foam ear cups, and an intelligent
                battery system that lasts up to 40 hours. The X1 pairs
                instantly, stays comfortable, and keeps your playlists sounding
                exactly as the artist intended.
              </p>

              <ul className="grid gap-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  Multi-device pairing with seamless switching.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  Smart ambient mode keeps you aware on commutes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  Travel-ready case and USB-C fast charging.
                </li>
              </ul>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase text-slate-500">
                  Limited-Time Perk
                </p>
                <p className="mt-1 text-lg text-slate-800">
                  Subscribe now and unlock early access to accessories, same-day
                  shipping, and curated audio tips.
                </p>

                <button
                  onClick={handleSubscribeClick}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-400/40 transition hover:bg-blue-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Subscribe &amp; Get 10% Off
                </button>

                <button
                  onClick={handleAddToCart}
                  className="mt-4 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} ShopOne. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-900">
              Terms
            </a>
            <a href="#" className="hover:text-slate-900">
              Support
            </a>
          </div>
        </div>
      </footer>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                  Member Exclusive
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Subscribe &amp; Unlock 10% Off
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Receive launch alerts, concierge support, and curated
                  listening guides directly in your inbox.
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={handleCloseModal}
                className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form className="mt-6 space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-300/50"
              >
                Confirm Subscription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
