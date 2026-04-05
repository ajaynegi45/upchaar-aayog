"use client";

import HospitalCard from "@/components/HospitalCard";
import { useState } from "react";
import ChangeLocationModal from "@/components/ChangeLocationModal";
import { useSearchStore } from "@/store/useSearchStore";

export default function HospitalPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    location,
    setLocation,
    hospitalResults,
    filters,
    toggleFilter
  } = useSearchStore();

  const handleLocationConfirm = (newLoc: { state: string; district: string; pincode: string }) => {
    setLocation(newLoc);
    // In a real app, this would trigger a fetch with new coordinates/params
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-24">
      {/* Header Section */}
      <div className="mb-12 text-center" aria-labelledby="hospital-title">
        <h1
          id="hospital-title"
          className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight tracking-tight mb-4"
        >
          Ayushman Bharat <span className="text-primary-dark italic">Hospitals</span> Near You
        </h1>
        <p className="text-lg text-on-surface-variant font-medium mb-8">
          Find hospitals where eligible patients can receive free treatment
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/10 shadow-sm">
            <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">location_on</span>
            <span className="font-bold text-on-surface">{location.district} • {location.state} • {location.pincode}</span>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ml-2 text-primary text-sm font-bold hover:bg-primary-dim transition-all hover:cursor-pointer rounded-sm hover:text-white px-3 py-2">
              Change Location
            </button>
          </div>

          <ChangeLocationModal
            key={String(isModalOpen)}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleLocationConfirm}
          />

          <nav className="flex gap-3 w-full md:w-auto" aria-label="Filters">
            <button
              type="button"
              onClick={() => toggleFilter('nearest')}
              className={`flex-1 px-4 py-4 rounded-xl font-bold text-sm shadow-md transition-all outline-none focus:ring-4 focus:ring-primary/20 ${filters.nearest
                ? "bg-primary text-on-primary hover:bg-primary-dim"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              Nearest
            </button>
            <button
              type="button"
              onClick={() => toggleFilter('allHospitals')}
              className={`flex-1 px-4 py-4 rounded-xl font-bold text-sm transition-all outline-none focus:ring-4 focus:ring-on-surface/10 ${filters.allHospitals
                ? "bg-primary text-on-primary hover:bg-primary-dim shadow-md"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high shadow-sm"
                }`}
            >
              All Hospitals
            </button>
          </nav>
        </div>
      </div>

      {/* Important Info Banner */}
      <section
        className="bg-secondary-container/40 p-6 rounded-2xl flex gap-4 items-start mb-12 border border-secondary-container/30 shadow-inner"
        aria-label="Important Information"
      >
        <span className="material-symbols-outlined text-on-secondary-container text-2xl mt-0.5" aria-hidden="true">
          info
        </span>
        <p className="text-sm md:text-base leading-relaxed text-on-secondary-container font-bold">
          Treatment may be free under Ayushman Bharat if you are eligible. Check eligibility at the hospital helpdesk with your PMJAY card.
        </p>
      </section>

      {/* Hospital List */}
      <section className="space-y-8" aria-label="Hospital listings">
        <h2 className="sr-only">Available Hospitals</h2>
        {hospitalResults.map((hospital, index) => (
          <HospitalCard key={index} {...hospital} />
        ))}
      </section>

      {/* Pagination / Load More */}
      <div className="mt-12 text-center">
        <button
          type="button"
          className="px-12 py-4 bg-surface-container-low text-on-surface font-bold rounded-xl border border-outline-variant/20 hover:bg-surface-container hover:shadow-sm transition-all active:scale-95"
        >
          Load More Hospitals
        </button>
      </div>
    </main>
  );
}
