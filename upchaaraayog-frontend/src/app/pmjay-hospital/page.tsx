"use client";

import HospitalCard from "@/components/HospitalCard";
import HospitalFilters from "@/components/HospitalFilters";
import { useHospitalStore } from "@/store/useHospitalStore";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

export default function HospitalPage() {
  const {
    hospitalResults,
    isLoading,
    error,
    pagination,
    searchHospitals,
    filters,
    fetchStates,
    fetchDistricts,
    fetchRegionalMetadata
  } = useHospitalStore(
    useShallow((state) => ({
      hospitalResults: state.hospitalResults,
      isLoading: state.isLoading,
      error: state.error,
      pagination: state.pagination,
      searchHospitals: state.searchHospitals,
      filters: state.filters,
      fetchStates: state.fetchStates,
      fetchDistricts: state.fetchDistricts,
      fetchRegionalMetadata: state.fetchRegionalMetadata,
    }))
  );
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !filters.state) {
      return;
    }

    hasInitialized.current = true;

    void fetchStates();
    void fetchDistricts(filters.state);
    void fetchRegionalMetadata(filters.state);
    void searchHospitals(0);
  }, [fetchDistricts, fetchRegionalMetadata, fetchStates, filters.state, searchHospitals]);

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages - 1) {
      void searchHospitals(pagination.currentPage + 1);
    }
  };

  const hasMore = pagination.currentPage < pagination.totalPages - 1;
  const hasResults = hospitalResults.length > 0;
  const isStateSelected = !!filters.state;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      {/* Header Section */}
      <div className="mb-12 text-center prose prose-slate max-w-none">
        <h1 className="text-4xl md:text-6xl font-headline font-black text-on-surface leading-[1.1] tracking-tight mb-4">
          PMJAY <span className="text-primary italic">Hospitals</span>
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
          Find empanelled hospitals providing cashless treatment under Ayushman Bharat across India.
        </p>
      </div>

      {/* Filters Section */}
      <section className="mb-16">
        <HospitalFilters />
      </section>

      {/* Results Section */}
      <section className="space-y-12" aria-label="Hospital listings">
        {!isStateSelected ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-[3rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-7xl text-primary/20 scale-150">map</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black text-on-surface">Ready to start?</h3>
              <p className="text-on-surface-variant font-medium">Please select a State above to find available hospitals.</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 bg-error-container text-on-error-container rounded-3xl flex items-center justify-center gap-4 border border-error/20">
            <span className="material-symbols-outlined">error</span>
            <p className="font-bold">{error}</p>
          </div>
        ) : !isLoading && !hasResults ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-[3rem] border border-outline-variant/10 flex flex-col items-center gap-6">
            <span className="material-symbols-outlined text-7xl text-on-surface-variant/20">search_off</span>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-black text-on-surface">No hospitals found</h3>
              <p className="text-on-surface-variant font-medium text-sm">Try adjusting your filters or selecting a different district.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 pb-4 border-b border-outline-variant/10">
              <h2 className="text-sm font-black text-on-surface-variant/50 uppercase tracking-[0.2em]">
                Found {pagination.totalElements} Hospitals
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {hospitalResults.map((hospital) => (
                <HospitalCard key={hospital.id} {...hospital} />
              ))}
            </div>

            {/* Pagination / Load More */}
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="group relative px-12 py-5 bg-surface-container text-on-surface font-black rounded-2xl border-2 border-outline-variant/20 hover:border-primary/30 transition-all active:scale-[0.98] overflow-hidden hover:cursor-pointer"
                >
                  <span className={`flex items-center gap-3 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    Load More Hospitals
                    <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    </div>
                  )}
                </button>
              </div>
            )}
            
            {!hasMore && hasResults && (
              <p className="text-center text-on-surface-variant/40 text-sm font-bold pt-8">
                ✨ You&apos;ve reached the end of the list
              </p>
            )}
          </>
        )}
      </section>

      {/* Info Banner */}
      <div className="mt-24 p-8 bg-secondary-container/30 rounded-[2.5rem] border border-secondary-container/20 flex flex-col md:flex-row items-center gap-6 shadow-inner">
        <div className="w-16 h-16 bg-secondary-container flex items-center justify-center rounded-2xl shrink-0">
          <span className="material-symbols-outlined text-on-secondary-container text-3xl">info</span>
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-on-secondary-container font-black">Important Treatment Information</h4>
          <p className="text-on-secondary-container/80 text-sm font-medium leading-relaxed">
            Treatment under Ayushman Bharat is completely cashless for eligible beneficiaries. Always verify your eligibility at the hospital&apos;s PMJAY helpdesk using your Ayushman Card before commencing treatment.
          </p>
        </div>
      </div>
    </main>
  );
}
