"use client";

import { ChangeEvent, useEffect } from "react";
import { useHospitalStore } from "@/store/useHospitalStore";
import type { HospitalFilters as HospitalFilterValues } from "@/store/types";
import { useShallow } from "zustand/react/shallow";

export default function HospitalFilters() {
  const {
    filters,
    metadata,
    setFilter,
    fetchStates,
    fetchSpecialities,
    searchHospitals,
    isLoading,
    isMetadataLoading,
    isSpecialitiesLoading,
  } = useHospitalStore(
    useShallow((state) => ({
      filters: state.filters,
      metadata: state.metadata,
      setFilter: state.setFilter,
      fetchStates: state.fetchStates,
      fetchSpecialities: state.fetchSpecialities,
      searchHospitals: state.searchHospitals,
      isLoading: state.isLoading,
      isMetadataLoading: state.isMetadataLoading,
      isSpecialitiesLoading: state.isSpecialitiesLoading,
    }))
  );

  useEffect(() => {
    void fetchStates();
  }, [fetchStates]);

  const handleSearch = () => {
    if (!filters.state) return;
    void searchHospitals(0);
  };

  const isStateSelected = !!filters.state;

  const handleMultiSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
    field: "schemeCodes" | "specialityIds"
  ) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
    if (field === "schemeCodes") {
      setFilter(field, selectedValues);
      return;
    }

    setFilter(
      field,
      selectedValues
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
    );
  };

  const loadSpecialitiesOnDemand = () => {
    if (!filters.state || metadata.specialities.length > 0 || isSpecialitiesLoading) {
      return;
    }

    void fetchSpecialities(filters.state, filters.district || undefined);
  };

  return (
    <div className="bg-surface-container-low p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-outline-variant/20 shadow-2xl shadow-primary/5 transition-all">
      <div className="flex flex-col gap-6 md:gap-8">
        
        {/* State Selection - Compulsory */}
        <div className="space-y-3">
          <label className="text-[11px] font-black text-primary uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            1. Select State
          </label>
          <div className="relative group">
            <select
              value={filters.state}
              onChange={(e) => setFilter("state", e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-outline-variant/20 px-5 py-4 rounded-2xl font-bold text-on-surface focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none appearance-none hover:border-primary/30 hover:cursor-pointer"
            >
              <option value="">Choose a State</option>
              {metadata.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none group-focus-within:text-primary transition-colors">
              map
            </span>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-all duration-500 ${
          isStateSelected ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-30 pointer-events-none translate-y-4'
        }`}>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] ml-2">2. District</label>
            <div className="relative group">
              <select
                value={filters.district}
                onChange={(e) => setFilter("district", e.target.value)}
                disabled={!isStateSelected}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/20 px-5 py-4 rounded-2xl font-bold text-on-surface focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none appearance-none disabled:bg-surface-container-low hover:cursor-pointer"
              >
                <option value="">All Districts</option>
                {metadata.districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 pointer-events-none">
                location_city
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] ml-2">3. Hospital Type</label>
            <div className="relative group">
              <select
                value={filters.hospitalType ?? ""}
                onChange={(e) => setFilter("hospitalType", e.target.value === "" ? null : (e.target.value as HospitalFilterValues["hospitalType"]))}
                disabled={!isStateSelected || isMetadataLoading}
                className="w-full bg-surface-container-lowest border-2 border-outline-variant/20 px-5 py-4 rounded-2xl font-bold text-on-surface focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none appearance-none disabled:bg-surface-container-low hover:cursor-pointer"
              >
                <option value="">All Hospital Types</option>
                {metadata.types.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 pointer-events-none">
                domain
              </span>
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] ml-2 flex items-center justify-between">
              4. Empanelment Schemes
              {isMetadataLoading && <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>}
            </label>
            <div className="relative group">
              <select
                multiple
                value={filters.schemeCodes}
                onChange={(event) => handleMultiSelectChange(event, "schemeCodes")}
                disabled={!isStateSelected || isMetadataLoading || metadata.schemes.length === 0}
                className="w-full min-h-40 bg-surface-container-lowest border-2 border-outline-variant/20 px-5 py-4 rounded-2xl font-bold text-on-surface focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none disabled:bg-surface-container-low"
              >
                {metadata.schemes.length === 0 ? (
                  <option value="" disabled>
                    {isStateSelected ? "No schemes found" : "Select a state first"}
                  </option>
                ) : (
                  metadata.schemes.map((scheme) => (
                    <option key={scheme.code} value={scheme.code}>
                      {scheme.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <p className="text-xs text-on-surface-variant/60 ml-2">
              Select one or more schemes from the dropdown list.
            </p>
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-[11px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] ml-2 flex items-center justify-between">
              5. Specialities
              {isSpecialitiesLoading && <span className="material-symbols-outlined animate-spin text-xs">progress_activity</span>}
            </label>
            <div className="relative group">
              <select
                multiple
                value={filters.specialityIds.map(String)}
                onChange={(event) => handleMultiSelectChange(event, "specialityIds")}
                onFocus={loadSpecialitiesOnDemand}
                onMouseDown={loadSpecialitiesOnDemand}
                onTouchStart={loadSpecialitiesOnDemand}
                disabled={!isStateSelected || isSpecialitiesLoading}
                className="w-full min-h-48 bg-surface-container-lowest border-2 border-outline-variant/20 px-5 py-4 rounded-2xl font-bold text-on-surface focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none disabled:bg-surface-container-low"
              >
                {isSpecialitiesLoading ? (
                  <option value="" disabled>
                    Loading specialities...
                  </option>
                ) : metadata.specialities.length === 0 ? (
                  <option value="" disabled>
                    {isStateSelected ? "Open this dropdown to load specialities" : "Select a state first"}
                  </option>
                ) : (
                  metadata.specialities.map((speciality) => (
                    <option key={speciality.code} value={speciality.code}>
                      {speciality.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <p className="text-xs text-on-surface-variant/60 ml-2">
              Specialities load only when this field is opened.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-6 md:pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="hidden md:block">
            {!isStateSelected ? (
              <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Waiting for state selection...</p>
            ) : (
              <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest tracking-[0.2em] animate-pulse">Ready to search hospitals</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={!isStateSelected || isLoading}
            className={`w-full sm:w-auto px-16 py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all hover:cursor-pointer active:scale-[0.98] ${
              !isStateSelected || isLoading
                ? "bg-surface-container-high text-on-surface-variant/20 cursor-not-allowed"
                : "bg-primary text-on-primary shadow-2xl shadow-primary/30 hover:bg-primary-dark"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Finding Hospitals...
              </div>
            ) : (
              "Apply & Search"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
