"use client";

import { AlertTriangle, MapPin, Phone, Map, Navigation } from "lucide-react";

export default function Day1Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Official-looking Header - This looks GOOD (the trap) */}
      <header className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h1 className="text-lg font-semibold">NEMA</h1>
              <p className="text-xs text-slate-300">
                National Emergency Management Agency
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Last Updated</p>
            <p className="text-sm">Jan 19, 2026 • 3:47 PM</p>
          </div>
        </div>
      </header>

      {/* Main Content - Aesthetic over Function */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Badge - Soft gray instead of red (bad design) */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full">
            Status: CRITICAL
          </span>
        </div>

        {/* Main Title - Elegant but too thin and light */}
        <h2 className="text-4xl font-light text-gray-400 mb-6 leading-tight">
          Hurricane Omega: Evacuation Mandate Effective Immediately
        </h2>

        {/* Sub-info - Treated as "secondary" text */}
        <div className="space-y-3 mb-12">
          <p className="text-sm text-gray-200 font-light">
            Affected Areas: Metro City, Coastal Districts 1-4
          </p>
          <p className="text-sm text-[#E5E5E5] font-light">
            A Category 5 Hurricane is making landfall. Storm surge of 15-20 feet
            expected. Residents must evacuate to designated shelters immediately.
          </p>
        </div>

        {/* Designated Shelters - The TRAP: tiny text for critical info */}
        <div className="mb-12">
          <h3 className="text-lg font-light text-gray-400 mb-6">
            Designated Shelters
          </h3>

          <div className="space-y-8">
            {/* Shelter 1 - Tiny, pale text */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-200 mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <p className="text-[10px] text-gray-200 font-light">
                    Lincoln High School Gymnasium
                  </p>
                  <p className="text-[10px] text-[#E5E5E5] font-light">
                    1234 Education Blvd., Metro City, FL 33101
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-[#E5E5E5]" />
                    <p className="text-[10px] text-[#E5E5E5] font-light">
                      (555) 789-0123
                    </p>
                  </div>
                  <p className="text-[9px] text-gray-200 font-light">
                    Capacity: 500 • Wheelchair Accessible • Pet-Friendly
                  </p>
                </div>
                {/* Ghost Buttons - No border, pale text */}
                <div className="flex gap-2">
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Call
                  </button>
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Map
                  </button>
                </div>
              </div>
            </div>

            {/* Shelter 2 - Tiny, pale text */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-200 mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <p className="text-[10px] text-gray-200 font-light">
                    Westside Community Center
                  </p>
                  <p className="text-[10px] text-[#E5E5E5] font-light">
                    5678 Oak St., Metro City, FL 33102
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-[#E5E5E5]" />
                    <p className="text-[10px] text-[#E5E5E5] font-light">
                      (555) 789-0456
                    </p>
                  </div>
                  <p className="text-[9px] text-gray-200 font-light">
                    Capacity: 350 • Wheelchair Accessible • Medical Staff On-Site
                  </p>
                </div>
                {/* Ghost Buttons */}
                <div className="flex gap-2">
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Call
                  </button>
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Map
                  </button>
                </div>
              </div>
            </div>

            {/* Shelter 3 - Tiny, pale text */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-200 mt-0.5 flex-shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <p className="text-[10px] text-gray-200 font-light">
                    Veterans Memorial Hall
                  </p>
                  <p className="text-[10px] text-[#E5E5E5] font-light">
                    999 Freedom Way, Metro City, FL 33103
                  </p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-[#E5E5E5]" />
                    <p className="text-[10px] text-[#E5E5E5] font-light">
                      (555) 789-0789
                    </p>
                  </div>
                  <p className="text-[9px] text-gray-200 font-light">
                    Capacity: 450 • Wheelchair Accessible • Generator Power
                  </p>
                </div>
                {/* Ghost Buttons */}
                <div className="flex gap-2">
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Call
                  </button>
                  <button className="text-[10px] text-gray-300 font-light px-3 py-1.5 hover:text-gray-400 transition-colors">
                    Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Instructions - Minimal contrast */}
        <div className="border-t border-gray-100 pt-8 mt-12">
          <h3 className="text-sm font-light text-gray-400 mb-4">
            Evacuation Guidelines
          </h3>
          <ul className="space-y-2 text-xs text-[#E5E5E5] font-light">
            <li>Bring identification, medications, and emergency supplies</li>
            <li>Do not drive through flooded areas</li>
            <li>Monitor local news for real-time updates</li>
            <li>Follow designated evacuation routes only</li>
          </ul>
        </div>

        {/* Footer - Minimalist */}
        <footer className="mt-16 pt-6 border-t border-gray-50">
          <p className="text-[10px] text-gray-300 text-center font-light">
            National Emergency Management Agency • In partnership with NOAA &
            National Weather Service
          </p>
        </footer>
      </div>
    </div>
  );
}
