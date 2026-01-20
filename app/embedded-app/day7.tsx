"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const sizeOptions = [
  { label: "Small", value: "S", description: "8\u2033 personal" },
  { label: "Medium", value: "M", description: "12\u2033 classic" },
  { label: "Large", value: "L", description: "16\u2033 sharing" },
];

const toppingOptions = [
  { label: "Cheese Burst", value: "cheese" },
  { label: "Pepperoni", value: "pepperoni" },
  { label: "Fresh Basil", value: "basil" },
  { label: "Roasted Corn", value: "corn" },
];

export default function Day7Page() {
  const [size, setSize] = useState<string>("");
  const [toppings, setToppings] = useState<string[]>([]);

  useEffect(() => {
    if (!size) return;
    setToppings([]);
  }, [size]);

  const handleSizeChange = (nextSize: string) => {
    setSize(nextSize);
  };

  const handleToppingToggle = (topping: string) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((item) => item !== topping)
        : [...prev, topping],
    );
  };

  const handleAddToOrder = () => {
    window.alert("done");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-rose-50 px-4 py-10 text-rose-950">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 rounded-[32px] border border-orange-200/80 bg-white/90 p-10 shadow-[0_30px_70px_-25px_rgba(225,108,72,0.6)]">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400">
            Chef&apos;s Builder
          </p>
          <h1 className="text-3xl font-semibold text-rose-950">
            Customize Your Pizza
          </h1>
          <p className="text-sm text-rose-500">
            Every change re-thinks everything. Choose wisely.
          </p>
        </header>

        <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-200 to-orange-200">
          <Image
            fill
            alt="Pizza placeholder"
            src="https://images.unsplash.com/photo-1548365328-8b47ebede988?auto=format&fit=crop&w=900&q=80"
            className="object-cover mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Oven Fresh
          </div>
        </div>

        <section className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
              Size Selection
            </p>
            <p className="text-sm text-rose-500">
              Tap one box. Only one stays checked even though they look
              independent.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {sizeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={size === option.value}
                      onChange={() => handleSizeChange(option.value)}
                      className="h-4 w-4 rounded-none border-2 border-orange-400 text-orange-500 accent-orange-600"
                    />
                    <div>
                      <p className="font-semibold text-rose-900">
                        {option.label}
                      </p>
                      <p className="text-xs text-rose-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Single choice
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-orange-400">
              Topping Selection
            </p>
            <p className="text-sm text-rose-500">
              They look like radios, but you can layer everything (after redoing
              it).
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {toppingOptions.map((topping) => {
                const active = toppings.includes(topping.value);
                return (
                  <button
                    key={topping.value}
                    type="button"
                    onClick={() => handleToppingToggle(topping.value)}
                    className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-rose-200"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-rose-400">
                      {active && (
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      )}
                    </span>
                    <span className="font-medium text-rose-900">
                      {topping.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="space-y-3 rounded-3xl border border-rose-100 bg-rose-50/60 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-400">
            Current Build
          </p>
          <div className="text-sm text-rose-600">
            <p>
              Size:{" "}
              <span className="font-semibold text-rose-900">
                {size || "none"}
              </span>
            </p>
            <p>
              Toppings:{" "}
              <span className="font-semibold text-rose-900">
                {toppings.length ? toppings.join(", ") : "none"}
              </span>
            </p>
          </div>
          <p className="text-xs text-rose-400">
            Changing the size after toppings quietly resets everything. Start
            over if you must.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddToOrder}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-red-500 py-4 text-center text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg shadow-orange-500/40 transition hover:opacity-90"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}
