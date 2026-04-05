"use client";

import StoreCard from "@/components/StoreCard";
import KendraMapView from "@/components/KendraMapView";
import ChangeLocationModal from "@/components/ChangeLocationModal";
import { useState, useEffect } from "react";
import { useKendraStore } from "@/store/useKendraStore";
import { useUserLocationStore } from "@/store/useUserLocationStore";

export default function KendraPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { location, setLocation } = useUserLocationStore();
  const {
    kendraResults,
    filters,
    toggleFilter,
    fetchKendraResults,
    pagination,
    isLoading,
    error
  } = useKendraStore();

  // Initial fetch on mount
  useEffect(() => {
    void fetchKendraResults(location, 0);
  }, [fetchKendraResults, location]);

  const handleLocationConfirm = (newLoc: { state: string; district: string; pincode: string }) => {
    setLocation(newLoc);
    void fetchKendraResults(newLoc, 0); // Fetch for new location starting from first page
    setIsModalOpen(false);
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages - 1) {
      void fetchKendraResults(location, pagination.currentPage + 1);
    }
  };

  const hasMore = pagination.currentPage < pagination.totalPages - 1;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
      {/* Header Section */}
      <section className="py-8 space-y-4" aria-labelledby="kendra-title">
        <div className="space-y-1">
          <h1
            id="kendra-title"
            className="text-4xl md:text-[2.75rem] font-headline font-extrabold text-on-background tracking-tight leading-tight"
          >
            Jan Aushadhi Stores <span className="text-primary-dark italic">Near You</span>
          </h1>
          <p className="text-on-surface-variant text-lg font-medium">Showing nearest stores based on your location</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/10 shadow-sm">
            <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">location_on</span>
            <span className="font-bold text-on-surface">{location.district} • {location.state}{location.pincode && ` • ${location.pincode}`}</span>
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

          <nav className="flex items-center gap-3" aria-label="Filters">
            <button
              type="button"
              onClick={() => toggleFilter('nearest')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all active:scale-95 ${filters.nearest
                ? "bg-primary-container text-on-primary-container hover:brightness-95"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              Nearest
            </button>
            <button
              type="button"
              onClick={() => toggleFilter('openNow')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all active:scale-95 ${filters.openNow
                ? "bg-primary-container text-on-primary-container hover:brightness-95"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }`}
            >
              Open Now
            </button>
          </nav>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8 pb-12 mb-8 justify-center">
        {/* Left Column: Store Cards (Scrollable list) */}
        <div className="w-full  space-y-4 md:overflow-y-auto md:pr-4 custom-scrollbar justify-center">
          <h2 className="sr-only">Store List</h2>

          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {kendraResults.map((store, index) => (
            <StoreCard key={index} {...store} />
          ))}

          {isLoading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-surface-container-low animate-pulse rounded-2xl border border-outline-variant/10" />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <button
              type="button"
              onClick={handleLoadMore}
              className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant font-bold text-sm hover:bg-surface-container-low hover:border-primary/30 transition-all active:scale-[0.99] hover:cursor-pointer"
            >
              Load more stores
            </button>
          )}

          {!hasMore && kendraResults.length > 0 && !isLoading && (
            <p className="text-center text-on-surface-variant/60 text-sm py-4">No more stores found in this area</p>
          )}

          {!isLoading && kendraResults.length === 0 && !error && (
            <div className="text-center py-12 space-y-3">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">search_off</span>
              <p className="text-on-surface-variant font-medium">No stores found for selected location</p>
            </div>
          )}
        </div>

        {/* Right Column: Map View */}
        {/*<div className="w-full md:w-[60%] sticky top-24 h-fit">*/}
        {/*  <KendraMapView />*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
