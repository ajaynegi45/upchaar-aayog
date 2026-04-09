"use client";

import {useEffect, useState} from "react";
import {useUserLocationStore} from "@/store/useUserLocationStore";
import {useLocationStore} from "@/store/useLocationStore";

type ComponentName = "Kendra" | "Hospital" | "Medicine";

interface FilterModalProps {
    componentName: ComponentName;
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: (location: { state: string; district: string; pincode: string }) => void;
}

export default function FilterModal({isOpen, componentName, onClose, onConfirm}: FilterModalProps) {
    const {location, setLocation} = useUserLocationStore();
    const {
        states,
        districtsByState,
        fetchStates,
        fetchDistricts,
        isLoadingStates,
        isLoadingDistricts
    } = useLocationStore();

    // Internal state now holds names directly as strings
    // We initialize these from props, but reset them using the 'key' prop in the parent
    // to avoid cascading renders in useEffect.
    const [selectedStateName, setSelectedStateName] = useState(location.state);
    const [district, setDistrict] = useState(location.district);
    const [pincode, setPincode] = useState(location.pincode);
    const [detecting, setDetecting] = useState(false);

    // Fetch initial states when the component mounts (which is when it opens due to 'key' prop)
    useEffect(() => {
        void fetchStates();
    }, [fetchStates]);

    // Fetch districts when state changes
    useEffect(() => {
        if (selectedStateName) {
            void fetchDistricts(selectedStateName);
        }
    }, [selectedStateName, fetchDistricts]);

    // Derived state for districts list
    const districts = districtsByState[selectedStateName] || [];

    // Use derived effective district to avoid cascading renders in useEffect
    const effectiveDistrict = district || (districts.length > 0 ? districts[0] : "");

    // Handle state change - reset district here to avoid cascading renders in useEffect
    const handleStateChange = (newStateName: string) => {
        setSelectedStateName(newStateName);

        // Proactively fetch districts if not already in cache
        void fetchDistricts(newStateName);

        // Reset district selection when state changes
        setDistrict("");
    };

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
        setDetecting(false);
        if (states.includes("Delhi")) {
            setSelectedStateName("Delhi");
            setDistrict("Rohini");
        }
        setPincode("110085");
    };

    const handleDetectLocation = () => {
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(gotLocation, failedToGetLocation);
    };

    const handleConfirm = () => {
        const newLocation = {state: selectedStateName, district: effectiveDistrict, pincode};
        setLocation(newLocation);
        if (onConfirm) onConfirm(newLocation);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
                 aria-modal="true">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-inverse-surface/65 backdrop-blur-md transition-opacity duration-300"
                    onClick={onClose}
                />

                {/* Modal */}
                <div
                    className="relative bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-[0px_48px_64px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 border border-outline-variant/10 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">

                    {/* Header */}
                    <div className="px-8 pt-10 pb-6">
                        <h2 className="text-3xl font-headline font-black text-on-surface tracking-tight mb-2">
                            Change Location
                        </h2>
                        <p className="text-on-surface-variant font-medium text-sm leading-relaxed opacity-80">
                            Select your area to see relevant healthcare services and nearby facilities.
                        </p>
                    </div>

                    <div className="px-8 pb-10 space-y-6">

                        {/* Fastest Option */}
                        {/* <section>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-4 block opacity-60">
                Fastest Option
              </label>

              <button
                onClick={handleDetectLocation}
                disabled={detecting || isLoadingStates}
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
            </section> */}

                        {/* Divider */}
                        {/* <div className="flex items-center gap-6">
              <div className="h-px flex-grow bg-outline-variant/15"></div>
              <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
                Or enter manually
              </span>
              <div className="h-px flex-grow bg-outline-variant/15"></div>
            </div> */}

                        {/* Manual Entry */}
                        <section className="space-y-6">

                            {/* Responsive State + District */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* State */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">
                                        State
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedStateName}
                                            onChange={(e) => handleStateChange(e.target.value)}
                                            disabled={isLoadingStates}
                                            className="custom-select w-full h-12 bg-surface-container-high border-2 border-transparent rounded-xl px-4 pr-10 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer hover:bg-surface-variant disabled:opacity-50"
                                        >
                                            <option value=""
                                                    disabled>{isLoadingStates ? "Loading..." : "Select State"}</option>
                                            {states.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {isLoadingStates && (
                                            <div
                                                className="absolute inset-0 rounded-xl loading-shimmer pointer-events-none"/>
                                        )}
                                    </div>
                                </div>

                                {/* District */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">
                                        District
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={effectiveDistrict}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            disabled={!selectedStateName || isLoadingDistricts}
                                            className="custom-select w-full h-12 bg-surface-container-high border-2 border-transparent rounded-xl px-4 pr-10 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer hover:bg-surface-variant disabled:opacity-50"
                                        >
                                            <option value=""
                                                    disabled>{isLoadingDistricts ? "Loading..." : "Select District"}</option>
                                            {districts.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        {isLoadingDistricts && (
                                            <div
                                                className="absolute inset-0 rounded-xl loading-shimmer pointer-events-none"/>
                                        )}
                                    </div>
                                </div>
                            </div>


                            {componentName == "Hospital" ? "" :
                                <>
                                    {/* Divider */}
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="h-px flex-grow bg-outline-variant/15"></div>
                                          <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] opacity-40 whitespace-nowrap">
                                            Or enter pincode
                                          </span>
                                        <div className="h-px flex-grow bg-outline-variant/15"></div>
                                    </div>

                                    {/* Pincode */}

                                    <div className="flex flex-col gap-2">
                                        <label
                                            className="text-[11px] font-bold text-on-surface/80 ml-1 uppercase tracking-wider">Pincode</label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            placeholder="e.g. 110001"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                                            className="w-full h-12 bg-surface-container-high border-2 border-transparent rounded-xl px-5 text-sm font-bold text-on-surface focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all outline-none placeholder:text-outline/40 hover:bg-surface-variant"
                                        />
                                    </div>
                                </>}
                        </section>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-6 border-t border-outline-variant/10">
                            <button
                                onClick={handleConfirm}
                                disabled={(pincode.length !== 6) && (!selectedStateName || !effectiveDistrict)}
                                className="w-full py-4.5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl font-black shadow-xl shadow-primary/10 active:scale-[0.98] transition-all hover:shadow-2xl hover:brightness-105 hover:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                Confirm Location
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-on-surface-variant font-bold text-sm hover:text-on-surface hover:bg-surface-container hover:cursor-pointer transition-all rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}