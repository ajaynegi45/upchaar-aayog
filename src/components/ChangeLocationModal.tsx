"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

interface ChangeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { state: string; district: string; pincode: string }) => void;
}

// Sample States & Districts mapping (add all 28 states + 8 UTs + ~900 districts as needed)
const STATE_DISTRICT_MAP: Record<string, string[]> = {
  Haryana: ["Gurugram", "Faridabad", "Rohtak", "Ambala"],
  Delhi: ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "Rohini"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Varanasi"],
  // Add remaining states + UTs here
};

export default function ChangeLocationModal({ isOpen, onClose, onConfirm }: ChangeLocationModalProps) {
  const states = useMemo(() => Object.keys(STATE_DISTRICT_MAP), []);
  const [state, setState] = useState(states[0]);
  const [district, setDistrict] = useState(STATE_DISTRICT_MAP[states[0]][0]);
  const [pincode, setPincode] = useState("");
  const [detecting, setDetecting] = useState(false);

  const districts = useMemo(() => STATE_DISTRICT_MAP[state] || [], [state]);

  // Update district when state changes
  useEffect(() => {
    setDistrict(districts[0] || "");
  }, [districts]);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);


  const failedToGetLocation = (error: GeolocationPositionError) => {
    console.error(error.message);
    setDetecting(false);
  };

  const gotLocation = (position: GeolocationPosition) => {
    console.log(position);
    setDetecting(false);

    // Example: you can extract coords if needed
    const { latitude, longitude } = position.coords;
    console.log(latitude, longitude);

    setState("Delhi");
    setDistrict("Rohini");
    setPincode("110085");
  };
  const handleDetectLocation = useCallback(() => {
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGetLocation);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm({ state, district, pincode });
    onClose();
  }, [state, district, pincode, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-inverse-surface/65 backdrop-blur-md transition-opacity duration-300"
            onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0px_48px_64px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 border border-outline-variant/10 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">

          {/* Header */}
          <div className="px-8 pt-10 pb-6">
            <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-2">
              Change Location
            </h2>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed opacity-80">
              Select your area to see relevant healthcare services and nearby facilities.
            </p>
          </div>

          <div className="px-8 pb-10 space-y-8">

            {/* Fastest Option */}
            <section>

              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-4 block opacity-60">
                Fastest Option
              </label>

              <button
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className={`group w-full flex items-center justify-center gap-3 py-4.5 rounded-xl font-black transition-all shadow-sm active:scale-95 hover:cursor-pointer  ${
                      detecting
                          ? "bg-surface-container-high text-on-surface-variant border-transparent"
                          : "bg-primary-container text-on-primary-container hover:text-white/90 hover:bg-primary-dim"
                  }`}
              >
              <span className={`material-symbols-outlined text-xl ${detecting ? "animate-spin" : "group-hover:animate-pulse"}`}>
                {detecting ? "sync" : "my_location"}
              </span>
                <span>{detecting ? "Detecting..." : "Use Current Location"}</span>
              </button>
            </section>

            {/* Divider */}
            <div className="flex items-center gap-6">
              <div className="h-px flex-grow bg-outline-variant/15"></div>
              <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
              Or enter manually
            </span>
              <div className="h-px flex-grow bg-outline-variant/15"></div>
            </div>

            {/* Manual Entry */}
            <section className="space-y-6">

              {/* Responsive State + District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* State */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">
                    State
                  </label>
                  <div className="relative">
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-14 bg-surface-container-high border-2 border-transparent rounded-xl px-5 pr-10 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none hover:bg-surface-variant"
                    >
                      {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface/60 transition-colors">
                    expand_more
                  </span>
                  </div>
                </div>

                {/* District */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">
                    District
                  </label>
                  <div className="relative">
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-14 bg-surface-container-high border-2 border-transparent rounded-xl px-5 pr-10 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer appearance-none hover:bg-surface-variant"
                    >
                      {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface/60 transition-colors">
                    expand_more
                  </span>
                  </div>
                </div>
              </div>

              {/* Pincode */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">Pincode</label>
                <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 122001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-14 bg-surface-container-high border-2 border-transparent rounded-xl px-6 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all outline-none placeholder:text-outline/40 hover:bg-surface-variant"
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-6">
              <button
                  onClick={handleConfirm}
                  className="w-full py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl font-black shadow-xl shadow-primary/20 active:scale-[0.98] transition-all hover:shadow-2xl hover:brightness-105 hover:cursor-pointer"
              >
                Confirm Location
              </button>
              <button
                  onClick={onClose}
                  className="w-full py-4 text-on-surface-variant font-bold text-sm hover:text-on-surface hover:bg-surface-container hover:cursor-pointer transition-all rounded-xl"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
  );
}