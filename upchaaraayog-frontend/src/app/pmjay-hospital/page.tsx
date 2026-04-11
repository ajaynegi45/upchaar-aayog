"use client";

import HospitalCard from "@/components/HospitalCard";
import {useHospitalStore} from "@/store/useHospitalStore";
import {useEffect, useRef} from "react";
import {useShallow} from "zustand/react/shallow";
import {HospitalTypeOption} from "@/store/types";
import { Skeleton } from 'boneyard-js/react'


export default function HospitalPage() {
    const {
        hospitalResults,
        isLoading,
        error,
        pagination,
        searchHospitals,
        filters,
        metadata,
        setFilter,
        fetchStates,
        fetchDistricts,
        fetchHospitalTypes,
        clearDefaultHospitalType,
    } = useHospitalStore(
        useShallow((state) => ({
            hospitalResults: state.hospitalResults,
            isLoading: state.isLoading,
            error: state.error,
            pagination: state.pagination,
            searchHospitals: state.searchHospitals,
            filters: state.filters,
            metadata: state.metadata,
            setFilter: state.setFilter,
            fetchStates: state.fetchStates,
            fetchDistricts: state.fetchDistricts,
            fetchHospitalTypes: state.fetchHospitalTypes,
            clearDefaultHospitalType: state.clearDefaultHospitalType,
        }))
    );

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        void fetchStates();

        // Initial search for default state
        if (filters.state) {
            void fetchDistricts(filters.state);
            void fetchHospitalTypes(filters.state);
            void searchHospitals(0).then(() => {
                clearDefaultHospitalType();
            });
        }
    }, [fetchStates, fetchDistricts, fetchHospitalTypes, filters.state, searchHospitals, clearDefaultHospitalType]);

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages - 1) {
            void searchHospitals(pagination.currentPage + 1);
        }
    };

    const hasMore = pagination.currentPage < pagination.totalPages - 1;
    const hasResults = hospitalResults.length > 0;
    const isStateSelected = !!filters.state;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 pb-24">
            {/* Header Section */}
            <div className="mb-8 md:mb-12 text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-headline font-black text-on-surface leading-[1.1] tracking-tight mb-3">
                    Hospitals <span className="text-primary italic">Near You</span>
                </h1>
                <p className="text-base md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed px-4">
                    Find hospitals where eligible patients can receive cashless treatment across India.
                </p>
            </div>

            {/* Simple Inline Filters */}
            <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl md:rounded-3xl border border-outline-variant/20 shadow-md mb-8 md:mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* 1. State Filter (Compulsory) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">
                            State
                        </label>
                        <select
                            value={filters.state}
                            onChange={(e) => {
                                setFilter("state", e.target.value);
                                void searchHospitals(0);
                            }}
                            className="bg-surface border-2 border-outline-variant/20 rounded-xl px-4 py-3 font-bold text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                        >
                            <option value="">Select State</option>
                            {metadata.states.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. District Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">
                            District
                        </label>
                        <select
                            value={filters.district}
                            onChange={(e) => {
                                setFilter("district", e.target.value);
                                void searchHospitals(0);
                            }}
                            disabled={!isStateSelected || metadata.districts.length === 0}
                            className="bg-surface border-2 border-outline-variant/20 rounded-xl px-4 py-3 font-bold text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-50 disabled:bg-surface-container-low cursor-pointer"
                        >
                            <option value="">All Districts</option>
                            {metadata.districts.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Hospital Type Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">
                            Hospital Type
                        </label>
                        <select
                            value={filters.hospitalType ?? ""}
                            onChange={(e) => {
                                setFilter("hospitalType", e.target.value === "" ? null : e.target.value as HospitalTypeOption);
                                void searchHospitals(0);
                            }}
                            disabled={!isStateSelected}
                            className="bg-surface border-2 border-outline-variant/20 rounded-xl px-4 py-3 font-bold text-sm text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none disabled:opacity-50 disabled:bg-surface-container-low cursor-pointer"
                        >
                            <option value="">All Types</option>
                            {metadata.types.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <section aria-label="Hospital listings">
                {!isStateSelected ? (
                    <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined text-6xl text-primary/20">map</span>
                        <h3 className="text-xl md:text-2xl font-headline font-black text-on-surface">Select a State</h3>
                        <p className="text-on-surface-variant text-sm md:text-base font-medium">Please choose a state to view available hospitals.</p>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center justify-center gap-3 border border-error/20">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-bold text-sm md:text-base">{error}</p>
                    </div>
                ) : !isLoading && !hasResults ? (
                    <div className="text-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 flex flex-col items-center gap-4 shadow-sm">
                        <span className="material-symbols-outlined text-5xl md:text-6xl text-on-surface-variant/20">search_off</span>
                        <h3 className="text-xl md:text-2xl font-headline font-black text-on-surface">No hospitals found</h3>
                        <p className="text-on-surface-variant font-medium text-sm">Try adjusting your filters (different district or type).</p>
                    </div>
                ) : (
                    <>
                        {/*<div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-outline-variant/10">*/}
                        {/*    <h2 className="text-xs md:text-sm font-black text-primary-dark flex items-center gap-2">*/}
                                {isLoading && !hasResults ?
                                    <div className={"w-full flex flex-row items-center justify-center gap-2 mb-10 mt-[-5] animate-pulse antialiased"}>
                                        <p className={"text-xl text-primary"}>Searching</p>
                                        <span className="material-symbols-outlined animate-spin text-primary text-sm ml-1">progress_activity</span>
                                    </div>
                                    :
                                    <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-outline-variant/10">
                                        <h2 className="text-sm md:text-xl font-black text-primary-dark flex items-center gap-2">
                                    Found {pagination.totalElements} Hospitals
                                        </h2>
                                    </div>
                                }
                                {isLoading && hasResults && (
                                    <span className="material-symbols-outlined animate-spin text-primary text-[18px] ml-1">progress_activity</span>
                                )}
                        {/*    </h2>*/}
                        {/*</div>*/}
                        <Skeleton name="hospital-card" loading={isLoading} animate={"shimmer"}>
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                            {hospitalResults.map((hospital) => (
                                <HospitalCard key={hospital.id} {...hospital} />
                            ))}


                        </div>
                        </Skeleton>

                        {/* Pagination / Load More */}
                        {hasMore && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    type="button"
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="relative px-8 py-3.5 bg-surface-container text-on-surface font-bold text-sm rounded-xl border border-outline-variant/20 hover:bg-surface-container-high transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                                >
                                    <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                        Load More
                                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                                    </span>
                                    {isLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        )}

                        {!hasMore && hasResults && (
                            <p className="text-center text-primary-dark text-xs md:text-sm font-bold pt-20">
                                You&apos;ve reached the end of the list
                            </p>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
