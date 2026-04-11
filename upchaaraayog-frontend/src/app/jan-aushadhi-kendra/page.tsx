"use client";

import StoreCard from "@/components/StoreCard";
import FilterModal from "@/components/FilterModal";
import {useEffect, useState} from "react";
import {useKendraStore} from "@/store/useKendraStore";
import {useUserLocationStore} from "@/store/useUserLocationStore";
import { Skeleton } from 'boneyard-js/react'

export default function KendraPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {location, setLocation} = useUserLocationStore();
    const {kendraResults, filters, toggleFilter, fetchKendraResults, pagination, isLoading, error} = useKendraStore();

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
                    <p className="text-on-surface-variant text-lg font-medium">Showing nearest stores based on your
                        location</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                    <div
                        className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/10 shadow-sm">
                        <span className="material-symbols-outlined text-primary text-sm"
                              aria-hidden="true">location_on</span>

                        <span className="font-bold text-on-surface">
                            { location.pincode ? location.pincode : `${location.district} • ${location.state}`}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(!isModalOpen)}
                            className="ml-2 text-primary text-sm font-bold hover:bg-primary-dim transition-all hover:cursor-pointer rounded-sm hover:text-white px-3 py-2">
                            Change Location
                        </button>
                    </div>


                        <FilterModal
                        key={String(isModalOpen)}
                        componentName={"Kendra"}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleLocationConfirm}
                    />


                    {/* <nav className="flex items-center gap-3" aria-label="Filters">
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
          </nav> */}
                </div>
            </section>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row gap-8 pb-12 mb-8 justify-center items-center">
                {/* Left Column: Store Cards (Scrollable list) */}
                <div
                    className="w-full  flex flex-col  space-y-4 md:overflow-y-auto md:pr-4 custom-scrollbar justify-center items-center">
                    <h2 className="sr-only">Store List</h2>

                    {error && (
                        <div
                            className="p-4 bg-error-container text-on-error-container rounded-xl flex items-center gap-3">
                            <span className="material-symbols-outlined">error</span>
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {/*/!*isLoading*!/*/}
                    {/*{ true && (*/}
                    {/*    <div className="space-y-4">*/}
                    {/*        {[1, 2].map((i) => (*/}
                    {/*            <div key={i} className="flex flex-col gap-7 justify-center items-center w-175 h-40 bg-surface-container-highest animate-pulse rounded-2xl border border-outline-variant/10">*/}
                    {/*                <div className="w-80 h-10 bg-surface-container-low animate-pulse rounded-md flex justify-center items-center "><span className={"text-surface-container-highest"}>Loading..</span></div>*/}
                    {/*                <div className="w-80 h-10 bg-surface-container-low animate-pulse rounded-md"></div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*)}*/}


                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 animate-pulse">
                            <p className={"text-primary-dark font-medium"}>Loading</p>
                            <span className="material-symbols-outlined animate-spin text-primary-dark text-[18px] ml-1">progress_activity</span>
                        </div>
                    )}
                    <Skeleton name="store-card" loading={isLoading} animate={"shimmer"} >
                        { kendraResults.map((store, index) => (
                            <StoreCard key={index} {...store} />
                        ))}
                    </Skeleton>



                    {/* Load More Button */}
                    {hasMore && !isLoading && (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant font-bold text-md bg-surface-container-low hover:bg-surface-container-high hover:border-primary/30 transition-all active:scale-[0.99] hover:cursor-pointer mt-5"
                        >
                            Load more stores
                        </button>
                    )}

                    {!hasMore && kendraResults.length > 0 && !isLoading && (
                        <p className="text-center text-on-surface-variant/60 text-sm py-4">No more stores found in this
                            area</p>
                    )}

                    {!isLoading && kendraResults.length === 0 && !error && (
                        <div className="text-center py-12 space-y-3">
                            <span
                                className="material-symbols-outlined text-4xl text-on-surface-variant/40">search_off</span>
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
